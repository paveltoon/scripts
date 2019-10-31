var claimNumbers = [
"P001-6297708706-21201046",
"P001-4538836593-11002577"
];

for (var i = 0; i < claimNumbers.length; i++){
	var claim = db.claims.findOne({
      "customClaimNumber": claimNumbers[i]
    });

		var claimsId = claim._id;
		var claimsIdStr = claimsId.valueOf();
		
		var checkStatus = db.claims_status.findOne({"claimId": claimsIdStr, "statusCode": { $in: ["15", "53"] } });
		
		if (checkStatus != undefined){
		print(checkStatus.claimId + ";" + checkStatus.deptId);
		} else {
		    print(claimsIdStr);
		}
	}