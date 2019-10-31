var map = [
"P001-3082100249-25001463",
"P001-3082100249-25001485",
"P001-3082100249-25001726",
"P001-3082100249-25001745"
];
for (var i = 0; i < map.length; i++) {

var cursor = db.claims.find({ 
"customClaimNumber": map[i],
"currStatus.comment": "Статус создан автоматически через РЛДД",
"currStatus.statusCode": "2" });

cursor.forEach(function (claim) {
	var claimId = claim._id;
	var claimIdStr = claimId.valueOf();
	var lastStatusFind = db.claims_status.find({
			"claimId": claimIdStr
		}).sort({
			"statusDate": -1
		}).limit(2).toArray();
	if (lastStatusFind[0].statusCode == "2") {
		claim.currStatus.statusCode = lastStatusFind[1].statusCode;
		print(claim.customClaimNumber + " , Status: " + claim.currStatus.statusCode);
		db.claims.save(claim);
	}
});
};