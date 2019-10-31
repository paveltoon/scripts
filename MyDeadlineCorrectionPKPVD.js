var cursor = db.claims.find(
	{
		"customClaimNumber": {
			$in: [
"50-50/047-50/047/010/2019-1055"
			]
		},
 		"resultStatus" : {
			$exists: true
		},		 
		"claimCreate": { 
		$lte: ISODate("2019-03-22T21:00:00")
		}
	}

);

cursor.forEach(
	function(claim) {
		
		if (claim.currStatus.statusCode == "24") {
		var deadlineDateMS = claim.deadlineDate.getTime();
		var docSendDateMS = deadlineDateMS - (1440 * 60 * 1000);
		var docSendDateNew = new Date(docSendDateMS);
		
		
		claim.docSendDate = docSendDateNew;
		claim.daysToDeadline = 1;
		
		db.claims.save(claim);
		
		print(claim.customClaimNumber + " - corrected");
		} else {
			print(claim.customClaimNumber + " - has no 24 status");
		}
	}
);