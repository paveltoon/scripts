var mistake = /.*�\?.*/i;
var remoteConn = new Mongo("10.10.80.100:27017");

var cursor = db.operators.find({"fio": mistake});
cursor.forEach(function(oper){
    var newOper = oper.fio.split("�?").join("И")
    oper.fio = newOper;
    db.operators.save(oper);
    print(oper._id + ' ' + oper.deptId + ' ' + oper.username);
});

var iter = remoteConn.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;

for (var i in iter){
	if(iter[i].name.startsWith('omsu') || iter[i].name.startsWith('mfc')){
		var dbName = iter[i].name;
        var db = remoteConn.getDB(dbName);
        var users = db.users.find({ $or: [ { "name": mistake }, { "middleName": mistake }, { "surname": mistake } ] });
        users.forEach(function(user){
            if(user.name.startsWith('�?')){
                var splName = user.name.slice(2);
                user.name ="И" + splName;
                db.users.save(user);
                print(user._id + ' ' + dbName);
            } else if(user.middleName.startsWith('�?')){
                var splName = user.middleName.slice(2)
                user.middleName ="И" + splName;
                db.users.save(user);
                print(user._id + ' ' + dbName);
            } else if(user.surname.startsWith('�?')){
                var splName = user.surname.slice(2)
                user.surname ="И" + splName;
                db.users.save(user);
                print(user._id + ' ' + dbName);
            }
        });
	}
}