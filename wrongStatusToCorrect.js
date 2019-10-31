var cursor = db.claims.find({
	"currStatus.statusCode": "41",
	"claimCreate": { $gte: ISODate("2019-03-01T00:00:00+0300"), $lte: ISODate("2019-04-01T11:39:35.370+0300") }
});

cursor.forEach(
	function (claim){
		var Id = claim._id;
		var claimId = Id.valueOf();
		var statuses = db.claims_status.findOne({
			"claimId": claimId,
			"statusCode": "41" 
			});
		if (statuses == undefined) {
			var lastStatus = db.claims_status.find({"claimId": claimId,}).sort({"statusDate": -1}).limit(1).next();
			var lastCode = lastStatus.statusCode;
			
			var claimsUpdate = db.claims.update(
				{
				"_id" : Id,
                "currStatus.statusCode" : "41"
            },
            {
                $set : {
                "currStatus.statusCode" : lastCode
                }
            },
            {
                multi : true
            }
			);
			print("Updated CLAIMS: " + Id + " " + claimsUpdate.nModified + "/" + claimsUpdate.nMatched );
		}
		
	}
);