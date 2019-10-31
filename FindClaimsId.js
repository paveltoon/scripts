var file = cat('C:/MAP/map.txt');
var ccn = file.split('\n');

for (var i = 0; i < ccn.length; i++) {

	var claim = db.claims.findOne({
			"_id": ccn[i]
		});

	if (claim == undefined || claim == null) {
		// Если в ID есть "-", выдаст ошибку, поэтому переводим в ObjectId
		var newFind = db.claims.findOne({
				"_id": ObjectId.valueOf(ccn[i])
			});
		// Переход на ObjectId
		if (ccn[i].length > 24 || ccn[i].length < 20) {
			print("wrong ID");
		} else
			// Если соблюдаются прошлые правила, то переходим в поиск по ObjectId
			if (newFind == undefined || newFind == null) {
				var lastFind = db.claims.findOne({
						"_id": ObjectId(ccn[i])
					});
					//Если не находит ObjectId
				if (lastFind == undefined || lastFind == null) {
					print("wrong ID");
				} else if (lastFind.deptId != undefined) {
					print(lastFind.deptId);
				} else {
					print("no deptId");
				}
			}
			// Если заявка найдена, то все ок, ищет deptId
	} else if (claim.deptId != undefined) {
		print(claim.deptId);
	} else {
		print("no deptId");
	}
}