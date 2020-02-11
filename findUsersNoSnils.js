var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = remoteConn.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;

for (var i in dbs) {
    var dbName = dbs[i].name;
    if (dbName.startsWith('mfc')) {
        var db = remoteConn.getDB(dbName)
        db.users.find({
            $or: [{
                "snils": "___-___-___ __"
            }, {
                "snils": ""
            }, {
                "snils": {
                    $exists: false
                }
            }]
        }).forEach(function (user) {
            var fio = user.surname + ' ' + user.name + ' ' + user.middleName;
            var login = user.login;
            print(fio + ';' + login + ';' + dbName)
        })
    }

}