var cursor = db.claims.find({ 
"service.srguServicePassportId": "5000000010000000897", 
"claimCreate": { $gte: ISODate("2018-12-31T21:00:00.000+0000")}, 
"currStatus.statusCode": { $in: ["53", "15"] } 
});

cursor.forEach(function(claim) {
	var claimId = claim._id;
	var claimIdStr = claimId.valueOf();
	var lastStatusFind = db.claims_status.find({"claimId" : claimIdStr}).sort({"statusDate" : -1}).limit(2).toArray();
	if (lastStatusFind[1].statusCode == "7") {
		claim.currStatus.statusCode = "7";
		print(claim.customClaimNumber + " " + claim.deptId);
		db.claims.save(claim);
	}
});