function getActualDate(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return (dt + '.' + month + '.' + year + " / " + hour + ':' + minute + ':' + second);
};
print("Provider ID;Provider FIO;MFC;Person ID;Person FIO;Old document ID;Old File;Old md5;Old claim;Old Activation Date;Old Status code;Old resultStatus;Old SRGU Passport ID;Old SRGU Passport Name;New document ID;New File;New md5;New claim;New Activation Date;New Status code;New resultStatus;New SRGU Passport ID;New SRGU Passport Name");
var current = 0;

var remoteConn = new Mongo("10.10.80.100:27017");
var iter = remoteConn.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;

for (var i = 0; i < iter.length; i++) {
    if (iter[i].name.startsWith('mfc')) {
        var dbName = iter[i].name;
        var remote = remoteConn.getDB(dbName);
        var usersArr = [];
        var findUsers = remote.users.find({
            "user_custom_role.staticUR": "OPERATOR"
        });

        findUsers.forEach(function (user) {
            usersArr.push(user._id.valueOf());
        });

        usersArr.forEach(function (element) {
            var cursor = db.claims.find({
                "activationDate": {
                    $gte: ISODate("2019-11-27T21:00:00.000+0000"),
                    $lte: ISODate("2019-11-28T21:00:00.000+0000")
                },
                "senderCode": /^5000000000.*/i,
                "creatorId": element
            });

            var personsObj = {};

            cursor.forEach(function (claim) {
                var ccn = claim.customClaimNumber;
                var origId = claim._id.valueOf();
                var passport = db.docs.findOne({
                    "ownerId": origId,
                    $or: [{
                        "title": /.*паспорт.*/i
                    }, {
                        "title": /.*личность заявителя.*/i
                    }]
                });
                if (passport != (undefined && null) && passport.fileMetadata && passport.fileMetadata._id && passport.fileMetadata.md5) {
                    current++;

                    var provider = claim.providerName;
                    var docId = passport._id.valueOf()
                    var person = claim.persons[0];
                    var personFio = claim.person.fio
                    var passMd5 = passport.fileMetadata.md5;
                    var fileDoc = passport.fileMetadata._id.valueOf();
                    var srguPassName = claim.service.srguServicePassportName;
                    var srguPassId = claim.service.srguServicePassportId;
                    var statusCode = claim.currStatus.statusCode;
                    var activationDate = getActualDate(claim.activationDate);
                    var dept = claim.creatorDeptId;

                    if(claim.resultStatus){
                        var resultStatus = claim.resultStatus;
                    } else {
                        var resultStatus = "false"
                    }
                    
                    if (personsObj[person] && personsObj[person].md5 != passMd5) {
                        
                        print(element + ';' + provider + ';' + dept + ';' + person + ';' + personFio + ';' + personsObj[person].doc + ';' + "http://rldd2.uslugi.mosreg.ru:8080/api/fs/file/" + personsObj[person].file + ';' + personsObj[person].md5 + ';' + personsObj[person].claim + ';' + personsObj[person].activationDate + ';' + personsObj[person].statusCode + ';' + personsObj[person].resultStatus + ';' + personsObj[person].passId + ';' + personsObj[person].passName + ';' + docId + ';' + "http://rldd2.uslugi.mosreg.ru:8080/api/fs/file/" + fileDoc + ';' + passMd5 + ';' + ccn + ';' + activationDate + ';' + statusCode + ';' + resultStatus + ';' + srguPassId + ';' + srguPassName);
                        
                    } else {
                        personsObj[person] = {
                            md5: passMd5,
                            claim: ccn,
                            doc: docId,
                            file: fileDoc,
                            passName: srguPassName,
                            passId: srguPassId,
                            statusCode: statusCode,
                            activationDate: activationDate,
                            resultStatus: resultStatus
                        }

                    }

                }
            });
        });
    }
}

print("Count: " + current);