//var remoteConn = new Mongo("10.10.80.100:27017");
var remoteConn = new Mongo("localhost:27017");

var dbs = db.adminCommand({
  listDatabases: 1
}).databases;
for (var i = 0; i < dbs.length; i++) {
  var dbName = dbs[i].name;

  if (!dbName.startsWith("mfc")) {
    continue;
  }

  var db = remoteConn.getDB(dbName);
  var usersAdmin = db.users.find({
    user_custom_role: {
      $elemMatch: {
        "staticUR": "ADMINISTRATOR"
      }
    },
    "login": {
      $nin: ["ppetrov", "support", "umfc", "portal", "portal1", "service", "mfc_u"]
    }
  });

  usersAdmin.forEach(function (user) {
    var permission = user.user_custom_role;
    for (var j = 0; j < permission.length; j++) {
      if (permission[j].staticUR == "ADMINISTRATOR") {
        permission.splice(j, 1);
        db.users.save(user);
        print('User: ' + user._id + ', Login: ' + user.login + ", has been updated. MFC: " + dbName);
      }
    }
  });
}