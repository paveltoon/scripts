var iteration = 0;
var totalFixed = 0;

//var remoteConn = new Mongo("10.10.80.100:27017");

var claimCursor = db.claims.find(
	{"customClaimNumber": { $in: ["M503-5888990174-23567987",
"M503-4211272640-22568250"] } }
	//{ "service.srguServiceId": "10000049816", "currStatus.statusCode": "56" }
).addOption(DBQuery.Option.noTimeout);
 
function getActualDate(date){
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();
 
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
 
	return(dt + '.' + month + '.' + year);
};

//function findService(srguServiceId, mfcDb, oktmo){
	//var omsuDept = db.departments.findOne({ $and: [ { "oktmo": oktmo}, { "name": /^omsu-.*/i } ] });
	/*	if(omsuDept == undefined)
			return "Not found";
	var omsuDb = omsuDept.name;
		if(omsuDb == undefined || omsuDb == "")
			return "Not found";
	
	var odb = remoteConn.getDB(omsuDb);
	var mdb = remoteConn.getDB(mfcDb);
	
	var mService = mdb.services.findOne({"serviceIdSrgu": srguServiceId});
	var oService = odb.services.findOne({"serviceIdSrgu": srguServiceId});
	
	if(mService != undefined && oService != undefined){
		return "OK";
	} else {
		return "Not found";
	}
};*/
 
function generateStatus(claim, statusCode, statusDate) {
	
	var status = {};
	var actualDate = getActualDate(new Date());
	
	if (typeof claim._id == "object"){
    	var claimStringId = claim._id.str;
    }
    else{
    claimStringId = claim._id;
    }
	
	status._id = new ObjectId();
	status.claimId = claimStringId;
	status.statusDate = statusDate;
	status.statusCode = statusCode;
	status.senderCode = claim.senderCode;
	status.senderName = claim.senderName;
	status.comment = "Статус был присвоен автоматически через РЛДД";
	status.deptId = claim.creatorDeptId;
	status.createDate = status.statusDate;
	status.lastModified = new Date();
	status.createBy = "rldd2";
	status.lastModifiedBy = "rldd2";
	status.createState = "COMPLETED";
	
	return status;
};
 
claimCursor.forEach(function(claim) {
	iteration++;
	//print(claim._id);
	var origClaimId = claim._id;
	var claimId = claim._id.valueOf();
	var service = claim.service.srguServiceId;
	/*var oktmo = claim.oktmo;
	var mfcDeptId = claim.creatorDeptId;*/
	
	//var serviceCheck = findService(service, mfcDeptId, oktmo);
	
	/*if(serviceCheck == "Not found"){
		print("Iteration: " + iteration + "; so far updated: " + totalFixed + "; claim: " + origClaimId + "; service: " + service + "; not found one of both services, skipped.");
		return;
	} else if(serviceCheck == "OK"){*/
		
		
		var acceptStatusDate1 = new Date(( new Date() - 5000 ));
		var acceptStatus1 = generateStatus(claim, "3", acceptStatusDate1);
			acceptStatus1._class = "status";
		db.claims_status.save(acceptStatus1);
		delete acceptStatus1._class;
		
		var acceptStatusDate = new Date();
		var acceptStatus = generateStatus(claim, "62", acceptStatusDate);
			acceptStatus._class = "status";
		db.claims_status.save(acceptStatus);
		delete acceptStatus._class;
		
		
		
		var update = db.claims.update(
			{
				"_id": origClaimId
			},
			{
				$set: {
					"currStatus": acceptStatus,
					"resultStatus" : "3",
					"docSendDate" : acceptStatusDate1
				}/*,
				$unset: {
					"deptId": ""
				}*/
			}
		);
		
		totalFixed += update.nModified;		
		print("Iteration: " + iteration + "; so far updated: " + totalFixed + "; claim: " + origClaimId );
	//} else {
	//	print(claimId + ", shit happens.");
	//	return;
	//}
});
 
print("Fixed total: " + totalFixed + " claim(s).");