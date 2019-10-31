var iter = db.adminCommand( { listDatabases: 1, nameOnly: true} ).databases;
for (var i = 0; i < iter.length; i++){
	if(iter[i].name.startsWith('omsu')){
	print(iter[i].name);
	}
}
