var cursor = db.claims.find(
	{ "service.srguServiceId": "5000000000192339504", "currStatus.statusCode": "6", "currStatus.senderCode": "GUAG05002", "resultStatus": { $exists: true } }
);
 
cursor.forEach(
	function(claim) {
		var claimId = claim._id;
		var claimIdStr = claimId.valueOf();
		var statusRemove = db.claims_status.remove({"claimId" : claimIdStr, "senderCode": "GUAG05002"});
		var lastStatusFind = db.claims_status.find({"claimId" : claimIdStr}).sort({"statusDate" : -1}).limit(1).toArray();
		
		lastStatusFind.forEach(function (statuses) {

			var StatusDateMS = statuses.statusDate.getTime();
			var statusDateNew = new Date(StatusDateMS);
			
			var createDateMS = statuses.createDate.getTime();
			var createDateNew = new Date(StatusDateMS);
		

			var statusCodeNew = statuses.statusCode.valueOf();
			var senderCodeNew = statuses.senderCode.valueOf();
		
			var currStatusNew = { 
    "_id" : new ObjectId(), 
    "claimId" : claimIdStr, 
    "statusDate" : statusDateNew, 
    "statusCode" : statusCodeNew, 
    "senderCode" : senderCodeNew, 
    "createDate" : createDateNew, 
    "lastModified" : createDateNew, 
    "createBy" : "rldd2", 
    "lastModifiedBy" : "rldd2", 
    "createState" : "COMPLETED"
}
		claim.currStatus = currStatusNew;
		db.claims.save(claim);
		print(claim.customClaimNumber + " has been corrected. Id: " + claimIdStr);
		});
				
	});