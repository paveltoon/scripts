var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = db.adminCommand( { listDatabases: 1 } ).databases;

for (var i = 0; i < dbs.length; i++){
  var dbName = dbs[i].name;
  
  /* if (!dbName.startsWith('mfc') || !dbName.startsWith('omsu'))
    continue;*/
  
  if (dbName != ('omsu-ku'))
    continue;

  var db = remoteConn.getDB(dbName);
    //Удаление документов КРОМЕ АЙДИ ниже
  db.report_configurations.remove({ "title": "Жалоба", "_id": { $ne: ObjectId("59f88eaf0d484a9eddf8c04a") } });
}