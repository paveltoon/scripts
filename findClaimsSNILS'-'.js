function getActualDate(date) {
	year = date.getFullYear();
	month = date.getMonth() + 1;
	dt = date.getDate();

	if (dt < 10) {
		dt = '0' + dt;
	}
	if (month < 10) {
		month = '0' + month;
	}

	return (dt + '.' + month + '.' + year);
};

var cursor = db.claims.distinct("senderCode");

for (var i = 0; i < cursor.length; i++) {

	//Проверка есть ли senderCode
	if (cursor[i] == null || cursor[i] == undefined) {
		continue;
	} else {
		// Форматированные СНИЛС (со знаками '-' и ' ')
		var formatClaim = db.claims.find({
				"personsInfo.0.snils": {
					$exists: true
				},
				"senderCode": cursor[i],
				$or: [{
						"personsInfo.0.snils": /.* .*/i
					}, {
						"personsInfo.0.snils": /.*-.*/i
					}
				]
			}).sort({
				"claimCreate": -1
			}).limit(1);
		// Неформатированные СНИЛС
		var noFormatClaim = db.claims.find({
				"personsInfo.0.snils": {
					$exists: true
				},
				"senderCode": cursor[i],
				$or: [{
						"personsInfo.0.snils": {
							$not: /.*-.*/i
						}
					}, {
						"personsInfo.0.snils": {
							$not: /.* .*/i
						}
					}
				]
			}).sort({
				"claimCreate": -1
			}).limit(1);

		// Запуск функций вывода senderCode и других данных
		formatClaim.forEach(function (boo) {
			print(boo.senderCode + ' format ' + getActualDate(boo.claimCreate));
		});
		noFormatClaim.forEach(function (foo) {
			print(foo.senderCode + ' ne_format ' + getActualDate(foo.claimCreate));
		});
	}
}
