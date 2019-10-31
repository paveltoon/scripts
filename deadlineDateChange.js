function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

var cursor = db.claims.find({
		$and: [{
				"service.srguServiceId": "5000000000190677764"
			}, {
				"consultation": false
			}, {
				$or: [{
						"deadlineStages.0.deadline": {
							$exists: true
						}
					}, {
						"deadlineStages.0.deadline": {
							$ne: NumberInt(14)
						}
					}
				]
			}, {
				$or: [{
						"deadline": {
							$exists: true
						}
					}, {
						"deadline": {
							$ne: NumberInt(14)
						}
					}
				]
			}
		]
	});

//var cursor = db.claims.find({ "_id": ObjectId("5a8685ada78e153a02f149be") });

cursor.forEach(function (claim) {
	var currDeadline = 14;
	if ((claim.deadline != undefined || claim.deadlineStages[0].deadline != undefined) && claim.deadlineDate != undefined) {

		if (claim.deadline != undefined) {
			currDeadline = claim.deadline;
			claim.deadline = 14;
		} else if (claim.deadlineStages[0].deadline != undefined) {
			currDeadline = claim.deadlineStages[0].deadline;
			claim.deadlineStages[0].deadline = 14;
		}
		var dateDiff = 14 - currDeadline;

		claim.deadlineDate = addDays(claim.deadlineDate, dateDiff);
		db.claims.save(claim);

	} else {
		print("\tSmth went  wrong with " + claim._id);
	}
});
