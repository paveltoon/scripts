var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = ["omsu-balashikha", "omsu-bronnitsy", "omsu-chekhovskiy", "omsu-chernogolovka", "omsu-dmitrovskiy", "omsu-dolgoprudnyy", "omsu-domodedovo", "omsu-dubna", "omsu-dzerzhinskiy", "omsu-egoryevskiy", "omsu-elektrogorsk", "omsu-elektrostal", "omsu-fryazino", "omsu-himki", "omsu-istrinskiy", "omsu-ivanteevka", "omsu-kashirskiy", "omsu-klinskiy", "omsu-kolomna", "omsu-korolev", "omsu-kotelniki", "omsu-krasnoarmeysk", "omsu-krasnogorskiy", "omsu-krasnoznamensk", "omsu-leninskiy", "omsu-lobnya", "omsu-losino-petrovskiy", "omsu-lotoshinskiy", "omsu-lukhovitsy", "omsu-lytkarino", "omsu-lyuberetskiy", "omsu-molodezhnyy", "omsu-mozhayskiy", "omsu-mytishchinskiy", "omsu-naro-fominskiy", "omsu-noginskiy", "omsu-odintsovskiy", "omsu-orekhovo-zuevo", "omsu-orekhovo-zuevskiy", "omsu-ozerskiy", "omsu-pavlovo-posadskiy", "omsu-podolsk", "omsu-protvino", "omsu-pushchino", "omsu-pushkinskiy", "omsu-ramenskiy", "omsu-reutov", "omsu-roshal", "omsu-ruzskiy", "omsu-serebryano-prudskiy", "omsu-sergievo-posadskiy", "omsu-serpukhov", "omsu-serpukhovskiy", "omsu-shakhovskiy", "omsu-shaturskiy", "omsu-shchelkovskiy", "omsu-solnechnogorsk", "omsu-stupinskiy", "omsu-taldomskiy", "omsu-vlasikha", "omsu-volokolamskiy", "omsu-voskhod", "omsu-voskresenskiy", "omsu-zarayskiy", "omsu-zhukovskiy", "omsu-zvenigorod", "omsu-zvezdniy"]
for (var i = 0; i < dbs.length; i++) {
  var dbName = dbs[i];



  var db = remoteConn.getDB(dbName);

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