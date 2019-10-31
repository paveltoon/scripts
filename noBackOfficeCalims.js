var cursor = db.claims.find(
	{
		"consultation" : false,
		"service.srguServiceId": {
			$in: [
				"5010000000167014828",
				"99900011",
				"147147000",
				"147147001",
				"11001761325",
				"88888888",
				"10000569524"
			]
		},
		"currStatus.statusCode": "1",
 		"resultStatus" : {
			$exists: true
		}
	}
);
 
cursor.forEach(
	function(claim) {
		var claimId = claim._id;
		var claimIdStr = claimId.valueOf();
		
		var resultStatus = db.claims_status.findOne({"claimId": claimIdStr, "statusCode": {$in: ["3", "4"]}});
		
		if (resultStatus != undefined) {
			delete resultStatus._class;
			claim.currStatus = resultStatus;
			
			db.claims.save(claim);
			print(claimIdStr + "\t" + "updated currStatus successfully (1).");
		} else {			
			var currStatusDateMS = claim.currStatus.statusDate.getTime();
			var docSendDateMS = currStatusDateMS + (10 * 60 * 1000);
			var docSendDate = new Date(docSendDateMS);
			
			var currStatus = {
				"_id" : new ObjectId(), 
				"claimId" : claimIdStr, 
				"statusDate" : docSendDate, 
				"statusCode" : claim.resultStatus, 
				"senderCode" : "DEV05001", 
				"senderName" : "Команда экстренной поддержки ЕИСОУ",
				"createDate" : docSendDate, 
				"lastModified" : docSendDate, 
				"createBy" : "rldd2", 
				"lastModifiedBy" : "rldd2", 
				"createState" : "COMPLETED"
			}
			
			db.claims_status.save(currStatus);
			
			claim.currStatus = currStatus;
			claim.docSendDate = docSendDate;
			
			db.claims.save(claim);
			print(claimIdStr + "\t" + "updated currStatus successfully (2).");
		}
	}
);