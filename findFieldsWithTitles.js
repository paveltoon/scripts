var cursor = db.claims.find({
	"service.srguDepartmentId": "5000000010000000255",
	"claimCreate": {
		$gte: ISODate("2019-07-17T00:00:00.000+0300"),
		$lte: ISODate("2019-07-17T16:00:00.000+0300")
	},
	"customClaimNumber": { $in: [
	  "P001-2692166526-26321397",
	  "P001-0634227687-26320658"
	  ] }
});

	cursor.forEach(function (claim) {
	  var titles = claim.fields.sequenceValue;
		for( var i = 0; i < titles.length; i++) {
		  var capcha = false;
			if(titles[i].title == "Отдел социальной защиты населения") {
			capcha = true;
			print(claim.customClaimNumber + " " + titles[i].value);
			return;
			} else if(i == titles.length-1 && capcha==false){
				print(claim.customClaimNumber + " Значение отсутствует");
				return;
			}
		}
	});
