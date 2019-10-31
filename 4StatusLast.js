
var cursor = db.claims_status.find(
    {
    "statusDate": {
        $gte: ISODate("2019-01-25T00:00:00.000+0000"),
        $lte: ISODate("2019-02-07T00:00:00.000+0000") 
    },
    "statusCode": "4" 
});


cursor.forEach(
	function(claim) {
		var claimId = claim.claimId;
		var result = db.claims.findOne({"_id": claimId,});
		if (result.resultStatus == undefined) {
			var currStatusDateMS = claim.createDate.getTime();
			var docDate = new Date(currStatusDateMS);
			db.claims.update(
				{
					"_id": claimId
				},
				{
					$set: {
						"resultStatus" : "4",
						"docSendDate" : docDate
					}
				},
				{
					multi: true
				}
			);
		}
	}
);
