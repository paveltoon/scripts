var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = db.adminCommand( { listDatabases: 1 } ).databases;
for (var i = 0; i < dbs.length; i++){
  var dbName = dbs[i].name;
  
  /* if (!dbName.startsWith('mfc') || !dbName.startsWith('omsu'))
    continue;*/
  
  if (dbName != ('mfc-work'))
    continue;

  var db = remoteConn.getDB(dbName);
  var usersAdmin = db.users.find( { user_custom_role:{ $elemMatch:{ "staticUR": "ADMINISTRATOR" }} , "login": { $nin: ["ppetrov", "support", "umfc", "portal", "portal1", "service" ] }});
  
  usersAdmin.forEach(function(s){
		var permission = s.user_custom_role;
		for (var j = 0; j < permission.length; j++) {
			if (permission[j].staticUR == "ADMINISTRATOR") {
		permission.splice(j, 1);
		db.users.save(s);
		}
	}
}
);
}