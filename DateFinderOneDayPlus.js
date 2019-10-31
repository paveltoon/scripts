var cursor = db.claims.find({
		"senderName": "AISLOD",
		"claimCreate": {
			$gte: ISODate("2019-03-31T21:00:00.000+0000"),
			$lte: ISODate("2019-04-31T21:00:00.000+0000")
		}
	}).forEach(function (findClaim) {
		var claimDate = findClaim.personsInfo[0].createDate;
		var dateDay = new Date(claimDate);
		var setDay = dateDay.setDate(dateDay.getDate() + 1);
		if (findClaim.claimCreate > (setDay)) {
			print(findClaim.customClaimNumber);
		}
	});