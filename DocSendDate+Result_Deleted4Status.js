var claimNumbers = [
	"P001-3321906518-11588586"
];
for (var i = 0; i < claimNumbers.length; i++) {
	var claim = db.claims.findOne({
			"customClaimNumber": claimNumbers[i]
		});

	if (claim == undefined) {
		print(claimNumbers[i] + " is wrong number");
		continue;
	}

	/*if (claim.resultStatus == undefined) {
	print(claim.customClaimNumber + " has no result status");
	continue;
	}*/

	var resultStatuses = db.claims_status.findOne({
			"claimId": claim._id.valueOf(),
			"statusCode": {
				$in: ["3", "4"]
			}
		});
	if (resultStatuses != undefined || resultStatuses != null) {
		var dateOfStatusMS = resultStatuses.statusDate.getTime();
		var dateOfStatus = new Date(dateOfStatusMS);

		claim.resultStatus = resultStatuses.statusCode;
		claim.docSendDate = dateOfStatus;

		print(claim.customClaimNumber + " - corrected");
		db.claims.save(claim);
	} else {
		print(claimNumbers[i] + " no resultStatus");
		continue;
	}
}