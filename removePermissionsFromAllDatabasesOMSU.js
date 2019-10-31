var srguId = "5901e4b9e716251b9ca48d48";
var remoteConn = new Mongo("localhost:27017");
var iter = db.adminCommand({
    listDatabases: 1,
    nameOnly: true
}).databases;
for (var i = 0; i < iter.length; i++) {
    if (iter[i].name.startsWith('omsu')) {
        var dbName = iter[i].name;
        var db = remoteConn.getDB(dbName);
        var findUser = db.users.find({});
        findUser.forEach(function (user) {
            if (user.user_custom_role != undefined) {
                var customRole = user.user_custom_role;
                for (var x = 0; x < customRole.length; x++) {
                    if (customRole[x].UserResolution != undefined) {
                        for (var resol = 0; resol < customRole[x].UserResolution.length; resol++) {
                            if (customRole[x].UserResolution[resol] != undefined && customRole[x].UserResolution[resol] != null) {
                                var resId = customRole[x].UserResolution[resol].$id.valueOf();
                                // Search services
                                var findRes = db.resolutions.findOne({
                                    "_id": ObjectId(resId),
                                    "services": DBRef("services", ObjectId(srguId))
                                });
                                if (findRes) {
                                    // Find, remove and save
                                    for (var y = 0; y < findRes.services.length; y++) {
                                        if (findRes.services[y] != null && findRes.services[y] != undefined && findRes.services[y].$id.valueOf() == srguId) {
                                            var deletedResolution = findRes.services.splice(y, 1);
                                            db.resolutions.save(findRes);
                                            print("Service with id: " + deletedResolution + " was deleted from " + resId + " resolution");
                                        }
                                    }
                                } else {
                                    continue;
                                }
                            }
                        }

                    } else {
                        continue;
                    }
                }
            }

        });
    }
}