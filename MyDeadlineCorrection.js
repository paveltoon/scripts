var cursor = db.claims.find(
	{
		"customClaimNumber": {
			$in: [
				"P001-9720495035-20241355",
				"P001-9720495035-20242706"
			]
		},
 		"resultStatus" : {
			$exists: true
		}
	}

);

cursor.forEach(
	function(claim) {
		var deadlineDateMS = claim.deadlineDate.getTime();
		var docSendDateMS = deadlineDateMS - (1440 * 60 * 1000);
		var docSendDateNew = new Date(docSendDateMS);
		
		
		claim.docSendDate = docSendDateNew;
		claim.daysToDeadline = 1;
		
		db.claims.save(claim);
		
		print(claim.customClaimNumber);
	}
);