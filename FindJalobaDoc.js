var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = db.adminCommand( { listDatabases: 1 } ).databases;
for (var i = 0; i < dbs.length; i++){
  var dbName = dbs[i].name;
  /* if (!dbName.startsWith('mfc') || !dbName.startsWith('omsu'))
    continue;*/
  
  if (dbName != ('omsu-ku'))
    continue;

  var db = remoteConn.getDB(dbName);
  var reportJal = db.report_configurations.find( { "title" : "Жалоба" });
  
  reportJal.forEach(function(s){
		
		
		if (!s._id.equals(ObjectId("59f88eaf0d484a9eddf8c04a"))) {
		
		print(s._id);
		}
  	});
}
