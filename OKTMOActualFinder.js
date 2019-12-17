var remoteConn = new Mongo("10.10.80.100:27017");
var iter = remoteConn.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;

for (var i = 0; i < iter.length; i++) {

    var dbName = iter[i].name;
    
    if (dbName.startsWith('omsu')) {
        var remote = remoteConn.getDB(dbName);
        var findOktmo = remote.orgcard.findOne({});
        if (findOktmo != (undefined && null) && findOktmo.oktmo != "") {
            print(dbName + ';' + findOktmo.oktmo);
        }
    }
}

for (var i = 0; i < iter.length; i++) {

    var dbName = iter[i].name;
    
    if (dbName.startsWith('mfc')) {
        var remote = remoteConn.getDB(dbName);
        var findOktmo = remote.orgcard.findOne({});
        if (findOktmo != (undefined && null) && findOktmo.oktmo != "") {
            print(dbName + ';' + findOktmo.oktmo);
        }
    }
}