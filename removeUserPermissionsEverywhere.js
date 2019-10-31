var srgu = [
    "5000000000186738830"
]

var srguId = [
    "5901e4b9e716251b9ca48d48"
]
for (var srguIteration = 0; srguIteration < srgu.length; srguIteration++) {
    var operatorCursor = db.getCollection("operators").find({

    }).addOption(DBQuery.Option.noTimeout);

    operatorCursor.forEach(function (dell) {

        if (dell.userPermissions != null && dell.userPermissions != undefined) {
            var permissionsUser = dell.userPermissions;
            for (var j = 0; j < permissionsUser.length; j++) {
                if (permissionsUser[j].role != "DEPARTMENTS") {
                    continue;
                } else
                if (permissionsUser[j].permissions != null && permissionsUser[j].permissions != undefined) {
                    var permitArray = permissionsUser[j].permissions;
                    if (permitArray != null && permitArray != undefined) {

                        var elemIndex = permitArray.indexOf(srgu[srguIteration]);
                        if (elemIndex != null && elemIndex != undefined && elemIndex != "-1") {

                            //Checkpart starts here
                            print("Found operators with ID   " + dell._id + ' ' + dell.username + ' ' + dell.deptId);

                            //Update starts here

                            var removeFromArray = permitArray.splice(elemIndex, 1);
                            permissionsUser[j].permissions = permitArray;
                            dell.lastModified = new Date();
                            db.getCollection("operators").save(dell);

                            print("Updated operator(s) with ID " + dell._id);

                            // Connect REMOUT DB
                            var remoteConn = new Mongo("localhost:27017");
                            var dataBase = remoteConn.getDB(dell.deptId);
                            var userName = dell.username;
                            var findUser = dataBase.users.find({
                                "login": userName
                            });
                            // Search roles & resolutions
                            findUser.forEach(function (user) {
                                var customRole = user.user_custom_role;
                                for (var x = 0; x < customRole.length; x++) {
                                    if (customRole[x].UserResolution != undefined) {
                                        for (var resol = 0; resol < customRole[x].UserResolution.length; resol++) {
                                            var resId = customRole[x].UserResolution[resol].$id.valueOf();
                                            // Search services
                                            var findRes = dataBase.resolutions.findOne({
                                                "_id": ObjectId(resId),
                                                "services": DBRef("services", ObjectId(srguId[srguIteration]))
                                            });
                                            if (findRes) {
                                                // Find, remove and save
                                                for (var y = 0; y < findRes.services.length; y++) {
                                                    if (findRes.services[y].$id.valueOf() == srguId[srguIteration]) {
                                                        var deletedResolution = findRes.services.splice(y, 1);
                                                        dataBase.resolutions.save(findRes);
                                                        print("Service with id: " + deletedResolution + " was deleted from " + resId + " resolution");
                                                    }
                                                }
                                            } else {
                                                continue;
                                            }

                                        }

                                    } else {
                                        continue;
                                    }
                                }
                            });

                        }

                    }

                }
            }
        }
    });
}