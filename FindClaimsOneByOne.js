var srgu = [
	"10000023334",
	"10000006704",
	"10000061925",
	"10000022795",
	"10000023695",
	"10000002008",
	"10000002755",
	"10001760860"
];

for (var i = 0; i < srgu.length; i++) {
	var cursor = db.claims.find({
			"service.srguServiceId": srgu[i],
			"consultation": {
				$ne: true
			},
			"currStatus.statusCode": {
				$ne: "86"
			},
			"oktmo": {
				$ne: "99999999"
			}
		}).limit(5);
		
	cursor.forEach(function (claim) {
	if (claim != null || claim != undefined) {
		print(claim.service.srguServiceId + ';' +
			claim.service.srguServicePassportName + ';' +
			claim.service.name + ';' +
			claim.service.srguServicePassportId + ';' +
			claim.service.srguDepartmentName + ';' +
			claim.service.srguDepartmentId + ';' +
			claim.customClaimNumber + ';' +
			claim.service.serviceType);
	} else {
		print(srgu[i]);
	}
}
)};