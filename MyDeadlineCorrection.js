// Claims list
var claimArr = [
	"B001-4285029713-32573976",
	"B001-7693539529-31764012",
	"B001-4093137189-31664104"
]
// Task number
var taskNum = "EISOUSUP-5627"

function getActualDate(date) {
	year = date.getFullYear();
	// DONT USE FOR REPORTS!!!
	month = date.getMonth();
	dt = date.getDate();

	if (dt < 10) {
		dt = '0' + dt;
	}
	if (month < 10) {
		month = '0' + month;
	}

	return (year + '-' + month + '-' + dt);
};

function daysBetweenDates(date1, date2) {
	var date1MS = date1.getTime();
	var date2MS = date2.getTime();

	var daysBetween = Math.ceil((date1MS - date2MS) / (1000 * 60 * 60 * 24));
	return daysBetween;
}

function correctDeadlineDate(date, deadlineStageDeadline) {
	var newDate = new Date(date);
	var correctDate = new Date(newDate.setDate(newDate.getDate() + deadlineStageDeadline + 1));

	var splittedDate = getActualDate(correctDate).split("-");
	return new Date(splittedDate[0], splittedDate[1], splittedDate[2]);
}
var cursor = db.claims.find({
	"customClaimNumber": {
		$in: claimArr
	},
	"resultStatus": {
		$exists: true
	},
	"daysToDeadline": {
		$lt: NumberInt(0)
	}
});

cursor.forEach(function (claim) {
	var origClaimId = claim._id;
	var ccn = claim.customClaimNumber;
	if (claim.deadlineStages != undefined || (claim.deadline != undefined && claim.deadlineInWorkDays != undefined)) {

		if (claim.deadlineStages == undefined) {
			var deadlineStages = [{
				"stageType": "REGULATION_TIME",
				"stageName": "Регламентный срок",
				"deadline": NumberInt(claim.deadline),
				"deadlineInWorkDays": claim.deadlineInWorkDays
			}]
		} else {
			var deadlineStages = claim.deadlineStages;
		}
		for (var i in deadlineStages) {
			deadlineStages[i].deadline = NumberInt(deadlineStages[i].deadline)
		}

		var daysToDeadline = claim.daysToDeadline;
		var deadlineDate = claim.deadlineDate;
		var docSendDate = claim.docSendDate;
		var diffDeadline = NumberInt(daysBetweenDates(docSendDate, deadlineDate));

		var newDeadlineStage = {
			"stageType": "DEADLINE_TRANSFER",
			"stageName": "Корректировка срока",
			"comment": taskNum,
			"deadline": diffDeadline,
			"deadlineInWorkDays": false
		};
		deadlineStages.push(newDeadlineStage)
		var newDeadlineDate = correctDeadlineDate(deadlineDate, newDeadlineStage.deadline);
		var newDaysToDeadline = NumberInt(daysToDeadline + diffDeadline);
		
		if (newDaysToDeadline < 0) {
			var deadlineUpdate2 = db.claims.update({
				"_id": claim._id
			}, {
				$set: {
					"deadlineDate": newDeadlineDate,
					"daysToDeadline": NumberInt(0),
					"deadlineStages": deadlineStages
				}
			});
			var mkuObject = {
				"id": null,
				"createDate": new Date(),
				"claimId": origClaimId,
				"statusDate": newDeadlineDate,
				"statusCode": "99",
				"senderCode": "RLDD"
			};
	
			db.claims_status_mku.save(mkuObject);
			print("[WARNING] Claim: " + ccn + ' have wrong daysToDeadline. Field daysToDeadline set to "0", progress: ' + deadlineUpdate2.nModified + ' / ' + deadlineUpdate2.nMatched);
			return;
		}


		//Update & Print
		var deadlineUpdate = db.claims.update({
			"_id": claim._id
		}, {
			$set: {
				"deadlineDate": newDeadlineDate,
				"daysToDeadline": NumberInt(newDaysToDeadline),
				"deadlineStages": deadlineStages
			}
		});
		print("Claim: " + ccn + " has been corrected, deadline " + newDaysToDeadline + " progress: " + deadlineUpdate.nModified + ' / ' + deadlineUpdate.nMatched)
		
		var mkuObject = {
			"id": null,
			"createDate": new Date(),
			"claimId": origClaimId,
			"statusDate": newDeadlineDate,
			"statusCode": "99",
			"senderCode": "RLDD"
		}

		db.claims_status_mku.save(mkuObject);
	} else {
		print("[WARNING] Claim: " + ccn + " doesnt have any deadline");
	}
});