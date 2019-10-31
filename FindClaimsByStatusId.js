var findClaims = db.claims_status.find({
		"statusCode": "43",
		"senderName": "ЕПГУ",
		"statusDate": {
			$gte: ISODate("2019-01-01T03:00:00.000+0300")
		}
	});

findClaims.forEach(function (claim) {
	var cId = claim.claimId.valueOf();
	if (cId.length == 24) {
		var curr = db.claims.find({ "_id": ObjectId(cId)}).next();
		print(curr.customClaimNumber + ";" + curr.service.name + ";" + curr.service.srguServiceId);
	} else {
		var curr = db.claims.find({ "_id": cId}).next();
	    print(curr.customClaimNumber + ";" + curr.service.name + ";" + curr.service.srguServiceId);
	}
});