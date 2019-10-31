//var rlddConn = new Mongo("10.10.80.20:27018");
/*var rlddConn = new Mongo("10.10.80.67:37017");
var rldd = rlddConn.getDB("rldd2");*/

//Enables authentication in rldd DB if needed (20 & 21 RLDD)
/*rldd.auth( {
   user: "rlddService",
   pwd: "1q2w3e4r"
} );*/



var operatorCursor = db.getCollection("operators").find(
	{ }
).addOption(DBQuery.Option.noTimeout);

operatorCursor.forEach(function(dell){

	
	if (dell.userPermissions != null && dell.userPermissions != undefined){
		var permissionsUser = dell.userPermissions;
		for (var j = 0; j < permissionsUser.length; j++){
					if (permissionsUser[j].role != "DEPARTMENTS"){
						continue;
					}
					else 
						if (permissionsUser[j].permissions != null && permissionsUser[j].permissions != undefined){
							var permitArray = permissionsUser[j].permissions;
							if (permitArray != null && permitArray != undefined){
							
								var elemIndex = permitArray.indexOf("5000000000188563714");
								if (elemIndex != null && elemIndex != undefined && elemIndex != "-1"){
								  
								  //Checkpart starts here
									print ("Found operators with ID   " + dell._id );
								  
								  //Update starts here
								//  permitArray[elemIndex] = "5000000000188175664";
								/*REMOVE*/ /* var removeFromArray = permitArray.splice(elemIndex, 1);
								  permissionsUser[j].permissions = permitArray;
								  dell.lastModified = new Date();
								  db.getCollection("operators").save(dell);
								  
								  print ("Updated operator(s) with ID " + dell._id );*/
								  
								  
								}
								
							}
							
						}
				}
	}

	
});