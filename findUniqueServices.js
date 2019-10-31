var remoteConn = new Mongo("10.10.80.100:27017");

var iter = db.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;

for (var i = 0; i < iter.length; i++) {
    if (iter[i].name.startsWith('mfc')) {
        var dbName = iter[i].name;
        var db = remoteConn.getDB(dbName);

        var cursor = db.services.find({ "isUnique": true });
        cursor.forEach(function(serv){
            var origId = serv._id.valueOf();
            var nameOrig = serv.fullName;
            var name = nameOrig.split('\n').join('').split('  ').join(' ')
            var servId = serv.serviceIdSrgu;
            var passId = serv.servicePassportIdSrgu;

            print(dbName + ';' + origId + ';' + name + ';' + servId + ';' + passId)
        })

    }
}