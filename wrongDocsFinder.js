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
                        
                        print(
                            "Provider ID: " + element + "\n" +
                            "Provider: " + provider + "\n" +
                            "MFC: " + dept + "\n" +
                            "\n" +
                            "Person ID: " + person + "\n" +
                            "Person: " + personFio + "\n" +
                            "\n" +
                            "Old document ID: " + personsObj[person].doc + "\n" +
                            "File: http://rldd2.uslugi.mosreg.ru:8080/api/fs/file/" + personsObj[person].file + "\n" +
                            "Old md5: " + personsObj[person].md5 + "\n" +
                            "Old claim: " + personsObj[person].claim + "\n" +
                            "Activation Date: " + personsObj[person].activationDate + "\n" +
                            "Status code: " + personsObj[person].statusCode + "\n" +
                            "resultStatus: " + personsObj[person].resultStatus + "\n" +
                            "SRGU Passport ID: " + personsObj[person].passId + "\n" +
                            "SRGU Passport Name: " + personsObj[person].passName + "\n" +
                            "\n" +
                            "New document ID: " + docId + "\n" +
                            "File: http://rldd2.uslugi.mosreg.ru:8080/api/fs/file/" + fileDoc + "\n" +
                            "New md5: " + passMd5 + "\n" +
                            "New claim: " + ccn + "\n" +
                            "Activation Date: " + activationDate + "\n" +
                            "Status code: " + statusCode + "\n" +
                            "resultStatus: " + resultStatus + "\n" +
                            "SRGU Passport ID: " + srguPassId + "\n" +
                            "SRGU Passport Name: " + srguPassName + "\n" +
                            "------------------------------------------------------------------\n"
                        );
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