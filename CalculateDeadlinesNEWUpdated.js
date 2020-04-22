var iteration = 0;
var total = 0;

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


function getDayOfYear(date) {
	var month = date.getMonth();
	var year = date.getFullYear();
	var days = date.getDate();
	for (var i = 0; i < month; i++) {
		days += new Date(year, i + 1, 0).getDate();
	}
	return days;
};

function getCalendar(year) {
	var calendar = db.calendars.findOne({
		$and: [{
				"year": year
			},
			{
				"oktmo": ""
			}
		]
	});

	if (calendar == undefined || calendar == null) {
		return "Not found";
	} else {
		return calendar.daysOff;
	}
};

function daysBetweenDates(dateFirst, dateSecond) {
	var first = dateFirst.setHours(0, 0, 0, 0);
	var second = dateSecond.setHours(0, 0, 0, 0);
	return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function calculateDeadline(startDate, deadline, workDays, day, oktmo) {
	if (workDays == undefined || workDays == null)
		workDays = false;

	var result = {};
	var deadlineCal = 0;
	var beginDay = day;
	var calNotFoundException = {};
	calNotFoundException.message = "Calendar not found for year: ";

	var claimYear = NumberInt(startDate.getFullYear());
	var holidays = getCalendar(claimYear);
	if (holidays == "Not found") {
		calNotFoundException.year = claimYear;
		return calNotFoundException;
	}
	var endOfClaimYearDate = new Date(new Date(claimYear, 12, 1) - 1);
	var endOfClaimYearDay = getDayOfYear(endOfClaimYearDate);

	if (workDays == false) {
		deadlineCal += deadline;
		day += deadline;
	} else {
		while (deadline > 0) {
			if (day > endOfClaimYearDay) {
				day -= endOfClaimYearDay;
				var newClaimYear = claimYear + 1;
				holidays = getCalendar(newClaimYear);

				if (holidays == "Not found") {
					calNotFoundException.year = newClaimYear;
					return calNotFoundException;
				}
			}
			if (holidays.indexOf(day) === -1) {
				deadlineCal++;
				day++;
				deadline--;
			} else {
				deadlineCal++;
				day++;
			}
		}
	}

	var ind = false;

	while (ind == false) {
		if (day > endOfClaimYearDay) {
			day -= endOfClaimYearDay;
			var newClaimYear = claimYear + 1;
			holidays = getCalendar(newClaimYear);

			if (holidays == "Not found") {
				calNotFoundException.year = newClaimYear;
				return calNotFoundException;
			}
		}
		if (holidays.indexOf(day) != -1) {
			deadlineCal++;
			day++;

			ind = false;
		} else {
			ind = true;
		}
	}

	result.deadlineCal = deadlineCal;
	result.resDay = day - beginDay;

	return result;
};

var claimCursor = db.getCollection("claims").find({
	"customClaimNumber": {
		$in: [
			"M503-1621196309-34760464"
		]
	}
}).addOption(DBQuery.Option.noTimeout);

claimCursor.forEach(function (claim) {
	iteration++;

	if (claim.stopRecalculatingDeadline == true) return;

	var origClaimId = claim._id;

	var deadlineCal = 0;

	var oktmo = claim.oktmo;
	if (oktmo == undefined) {
		print("(!) Claim " + origClaimId + " has no OKTMO, skipped.");
		return;
	}
	var startDate = claim.activationDate;
	if (startDate == undefined) {
		print("(!) Claim " + origClaimId + " has no activationDate, skipped.");
		return;
	}

	var claimCreateDay = getDayOfYear(startDate);

	var stages = claim.deadlineStages;
	var deadline = claim.deadline;
	var deadlineInWorkDays = claim.deadlineInWorkDays;
	var stagesUpdate = {
		"nModified": 0,
		"nMatched": 0
	};

	if (stages == undefined) {
		if (deadline == undefined || deadline == 0 || deadline == null) {
			print("(!) Claim " + origClaimId + " has NULL or EMPTY deadline without stages, skipped.");
			return;
		}

		if (deadlineInWorkDays == undefined || deadlineInWorkDays == null)
			deadlineInWorkDays = false;

		var deadlineStages = [{
			"stageType": "REGULATION_TIME",
			"stageName": "Регламентный срок",
			"deadline": NumberInt(deadline),
			"deadlineInWorkDays": deadlineInWorkDays
		}];

		stagesUpdate = db.claims.update({
			"_id": claim._id
		}, {
			$set: {
				"deadlineStages": deadlineStages
			}
		});
	}

	if (stages != undefined) {
		if (Object.keys(stages).length != 0) {
			for (var i = 0; i < stages.length; i++) {
				var deadline = stages[i].deadline;
				var workDays = stages[i].deadlineInWorkDays;

				if (deadline != 0) {
					var calculationResult = calculateDeadline(startDate, deadline, workDays, claimCreateDay, oktmo);
					if (calculationResult.message != undefined) {
						print("(!) " + calculationResult.message + calculationResult.year + "; claim " + origClaimId + " with OKTMO " + oktmo + ", skipped.");
						return;
					} else {
						deadlineCal += calculationResult.deadlineCal;
						claimCreateDay += calculationResult.resDay;
					}
				} else {
					print("(!) Deadline stage " + i + " in claim " + origClaimId + " has ZERO deadline, skipped.");
					continue;
				}
			}
		} else {
			print("(!) Claim " + origClaimId + " has empty deadlineStages, skipped.");
			return;
		}
	} else {
		var deadline = deadline;
		var workDays = deadlineInWorkDays;

		if (deadline != 0) {
			var calculationResult = calculateDeadline(startDate, deadline, workDays, claimCreateDay, oktmo);
			if (calculationResult.message != undefined) {
				print("(!) " + calculationResult.message + calculationResult.year + "; claim " + origClaimId + " with OKTMO " + oktmo + ", skipped.");
				return;
			} else {
				deadlineCal += calculationResult.deadlineCal;
			}
		} else {
			print("(!) Claim " + origClaimId + " has ZERO deadline, skipped.");
			return;
		}
	}

	if (deadlineCal == 0) {
		print("(!) Somehow we have zero deadline in claim " + origClaimId + ", skipped.");
		return;
	}

	var origClaimId = claim._id;
	var suspenseReason = claim.suspenseReason;

	var totalSuspenseDays = 0;
	if (claim.suspenseReason != undefined) {

		var suspenseReason = claim.suspenseReason;
		var startSuspenseDate = suspenseReason.createDate;
		var suspenseCalendar = getCalendar(startSuspenseDate.getFullYear());
		var incDays = 0;
		if (claim.currStatus.statusCode == "70") {
			// If Working Days
			if (suspenseReason.workingDays === true) {
				var count = 0;
				var daysCheck = getDayOfYear(startSuspenseDate);
				// Calculate calendar days
				while (count < suspenseReason.suspenseDays) {
					if (suspenseCalendar.indexOf(daysCheck) != -1) {
						daysCheck++;
						incDays++;
					} else {
						daysCheck++;
						count++;
					}
					// If new year is coming
					if (daysCheck >= 365) {
						daysCheck = 1;
						suspenseCalendar = getCalendar(startSuspenseDate.getFullYear() + 1);
					}
				}
			}
			totalSuspenseDays = incDays + suspenseReason.suspenseDays;
			var daysGone = daysBetweenDates(new Date(), startSuspenseDate);
			var susDays = totalSuspenseDays + daysGone;
			if (susDays < 0) {
				print('[WARNING] Claim ' + claim.customClaimNumber + ' has suspenseDays < 0');
				return;
			} else {
				var susUpd = db.claims.update({
					"_id": origClaimId
				}, {
					$set: {
						suspenseDays: NumberInt(susDays)
					}
				});
			}
		} else {
			var find70Status = db.claims_status.find({
				"claimId": origClaimId.valueOf()
			}).sort({
				"statusDate": 1
			}).toArray();
			for (var i = 0; i < find70Status.length; i++) {
				var status = find70Status[i];
				if (status.statusCode == "70" && find70Status[i + 1] != undefined) {
					var nextStatus = find70Status[i + 1];
					var statusDiff = daysBetweenDates(status.statusDate, nextStatus.statusDate);
					totalSuspenseDays += statusDiff;
				}
			}
		}
	}

	var startDateMs = startDate.setHours(0, 0, 0, 0);
	var startDateInMs = new Date(startDateMs).getTime();
	var deadlineCalInMs = deadlineCal * 24 * 60 * 60 * 1000;
	var suspenseDaysInMS = totalSuspenseDays * 24 * 60 * 60 * 1000;
	var deadlineDate = new Date(startDateInMs + deadlineCalInMs + suspenseDaysInMS);

	var completed = false;
	var days = 0;
	var daysToDeadline = 0;

	if (claim.resultStatus != undefined && claim.docSendDate != undefined) {
		var docSendDateMs = claim.docSendDate.setHours(0, 0, 0, 0);
		var docSendDateInMs = new Date(docSendDateMs).getTime();
		var daysInMs = deadlineDate - docSendDateInMs;
		days = (daysInMs / 1000 / 60 / 60 / 24);
		daysToDeadline = days < 1 ? NumberInt(Math.ceil(days)) : NumberInt(days);
		completed = true;
	} else if (claim.resultStatus == undefined && claim.docSendDate == undefined) {
		var now = new Date().setHours(0, 0, 0, 0);
		var daysInMs = deadlineDate - now;
		days = (daysInMs / 1000 / 60 / 60 / 24);
		daysToDeadline = days < 1 ? NumberInt(Math.ceil(days)) : NumberInt(Math.floor(days));
	} else {
		print("(!) Claim " + origClaimId + " completed incorrectly, skipped.");
		return;
	}

	print(claim.daysToDeadline + ' / ' + daysToDeadline + ' ' + claim.deadlineDate + ' / ' + deadlineDate);
	// Set deadline
	var deadlineUpdate = db.claims.update({
		"_id": claim._id
	}, {
		$set: {
			"deadlineDate": deadlineDate,
			"daysToDeadline": daysToDeadline
		}
	});

	var mkuObject = {
		"id": null,
		"createDate": new Date(),
		"claimId": origClaimId,
		"statusDate": deadlineDate,
		"statusCode": "99",
		"senderCode": "RLDD"
	}

	db.claims_status_mku.save(mkuObject);



	total += deadlineUpdate.nModified;
	print("I: " + iteration + ", SFU: " + total + "; hasResult: " + completed + "; DU/SU: " + deadlineUpdate.nModified + "/" + stagesUpdate.nModified + "; GUID: " + origClaimId + "; CCN: " + claim.customClaimNumber + "; created: " + getActualDate(startDate) + "; deadlineDate: " + getActualDate(deadlineDate) + "; daysToDeadline: " + daysToDeadline);
});

print("Updated total: " + total + " claim(s).");