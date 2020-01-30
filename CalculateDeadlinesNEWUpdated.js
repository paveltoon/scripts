var iteration = 0;
var total = 0;

function getActualDate(date){
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();
 
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
 
	return(dt + '.' + month + '.' + year);
};


function getDayOfYear(date){
    var month = date.getMonth();
    var year = date.getFullYear();
    var days = date.getDate();
		for (var i = 0; i < month; i++) {
			days += new Date(year, i + 1, 0).getDate();
		}
    return days;
};

function getCalendar(oktmo, year){
	var calendar = db.calendars.findOne(
		{ 
			$and: [ 
				{ 
					"year": year 
				}, 
				{ 
					"oktmo": oktmo 
				} 
			]
		}
	);
	
	if(calendar == undefined || calendar == null){
		return "Not found";
	} else {
		return calendar.daysOff;
	}	
};

function daysBetweenDates(dateFirst, dateSecond) {
    var first = dateFirst.getTime();
    var second = dateSecond.getTime();

    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function calculateDeadline(startDate, deadline, workDays, day, oktmo){
	if (workDays == undefined || workDays == null)
		workDays = false; 
	
	var result = {};
	var deadlineCal = 0;
	var beginDay = day;
	var calNotFoundException = {};
		calNotFoundException.message = "Calendar not found for year: ";
	
	var claimYear = NumberInt(startDate.getFullYear());	
	var holidays = getCalendar(oktmo, claimYear);
		if(holidays == "Not found"){
			calNotFoundException.year = claimYear;
			return calNotFoundException;
		}			
	var endOfClaimYearDate = new Date(new Date(claimYear, 12, 1) - 1);
	var endOfClaimYearDay = getDayOfYear(endOfClaimYearDate);

	if(workDays == false){
		deadlineCal += deadline;
		day += deadline;
	} else{
		while(deadline > 0){
			if(day > endOfClaimYearDay){
				day -= endOfClaimYearDay;
				var newClaimYear = claimYear + 1;
				holidays = getCalendar(oktmo, newClaimYear);
				
				if(holidays == "Not found"){
					calNotFoundException.year = newClaimYear;
					return calNotFoundException;
				}
			}
			if(holidays.indexOf(day) === -1){
				deadlineCal++;
				day++;		
				deadline--;
			} else{
				deadlineCal++;
				day++;
			}
		}
	}
	
	var ind = false;
		
	while(ind == false){
		if(day > endOfClaimYearDay){
			day -= endOfClaimYearDay;
			var newClaimYear = claimYear + 1;
			holidays = getCalendar(oktmo, newClaimYear);
			
			if(holidays == "Not found"){
				calNotFoundException.year = newClaimYear;
				return calNotFoundException;
			}
		}
		if(holidays.indexOf(day) != -1){
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

var claimCursor = db.getCollection("claims").find(
	{ "customClaimNumber": { $in: ["P001-6958344111-31963876"] } }
).addOption(DBQuery.Option.noTimeout);

claimCursor.forEach(function(claim){
	iteration++;
	
	if (claim.stopRecalculatingDeadline == true) return;
	
	var origClaimId = claim._id;
	
	var deadlineCal = 0;
	
	var oktmo = claim.oktmo;
		if(oktmo == undefined){
			print("(!) Claim " + origClaimId + " has no OKTMO, skipped.");
			return;
		}
	var startDate = claim.activationDate;
		if(startDate == undefined){
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

	if(stages == undefined){
		if (deadline == undefined || deadline == 0 || deadline == null) {
			print("(!) Claim " + origClaimId + " has NULL or EMPTY deadline without stages, skipped.");
			return;			
		}
		
		if (deadlineInWorkDays == undefined || deadlineInWorkDays == null)
			deadlineInWorkDays = false;
		
		var deadlineStages = [
			{
				"stageType" : "REGULATION_TIME", 
				"stageName" : "Регламентный срок", 
				"deadline" : NumberInt(deadline), 
				"deadlineInWorkDays" : deadlineInWorkDays
			}
		];
		
		stagesUpdate = db.claims.update(
			{
				"_id": claim._id
			},
			{
				$set:{
					"deadlineStages": deadlineStages
				}
			}
		);
	}
	
	if(stages != undefined){
		if(Object.keys(stages).length != 0){			
			for(var i = 0; i < stages.length; i++){
				var deadline = stages[i].deadline;
				var workDays = stages[i].deadlineInWorkDays;
			
				if(deadline != 0){
					var calculationResult = calculateDeadline(startDate, deadline, workDays, claimCreateDay, oktmo);
					if(calculationResult.message != undefined){
						print("(!) " + calculationResult.message + calculationResult.year + "; claim " + origClaimId + " with OKTMO " + oktmo + ", skipped.");
						return;
					} else{
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
	} else{
		var deadline = deadline;
		var workDays = deadlineInWorkDays;
	
		if(deadline != 0){
			var calculationResult = calculateDeadline(startDate, deadline, workDays, claimCreateDay, oktmo);
			if(calculationResult.message != undefined){
				print("(!) " + calculationResult.message + calculationResult.year + "; claim " + origClaimId + " with OKTMO " + oktmo + ", skipped.");
				return;
			} else{
				deadlineCal += calculationResult.deadlineCal;
			}
		} else {
			print("(!) Claim " + origClaimId + " has ZERO deadline, skipped.");
			return;
		}	
	}
	
	if(deadlineCal == 0){
		print("(!) Somehow we have zero deadline in claim " + origClaimId + ", skipped.");
		return;
	}
	
	var origClaimId = claim._id;
    var suspenseReason = claim.suspenseReason;
    var suspenseDaysResult = 0;

    if (suspenseReason != undefined || suspenseReason != null) {

        var statuses70 = db.claims_status.find({
            "claimId": origClaimId.valueOf(),
            $or: [{
                "statusCode": "70"
            }, {
                "statusCode": "71"
            }]
        }).sort({
            "statusDate": 1
        }).toArray();
        for (var j = 0; j < statuses70.length; j++) {
            if (statuses70[j].statusCode == "70" && statuses70[j + 1]!= undefined && statuses70[j + 1].statusCode == "71") {
				suspenseDaysResult += daysBetweenDates(statuses70[j].statusDate, statuses70[j + 1].statusDate);
				
            }
        }
    }

    var startDateMs = startDate.setHours(0,0,0,0);
    var startDateInMs = new Date(startDateMs).getTime();
	var deadlineCalInMs = deadlineCal * 24 * 60 * 60 * 1000;
	var deadlineDate = new Date(startDateInMs + deadlineCalInMs);
	
	var completed = false;
	var days = 0;
    var daysToDeadline = 0;
	
	if(claim.resultStatus != undefined && claim.docSendDate != undefined){
        var docSendDateMs = claim.docSendDate.setHours(0,0,0,0);
        var docSendDateInMs = new Date(docSendDateMs).getTime();
		var daysInMs = deadlineDate - docSendDateInMs;
		
		// Add Suspense days
		days = (daysInMs / 1000 / 60 / 60 / 24) + suspenseDaysResult;
		daysToDeadline = days < 1 ? NumberInt(Math.ceil(days)): NumberInt(days);
		completed = true;
	} else if(claim.resultStatus == undefined && claim.docSendDate == undefined) {
		var now = new Date().setHours(0,0,0,0);
		var daysInMs = deadlineDate - now;
		days = (daysInMs / 1000 / 60 / 60 / 24) + suspenseDaysResult;
		daysToDeadline = days < 1 ? NumberInt(Math.ceil(days)): NumberInt(Math.floor(days));
	} else {
		print("(!) Claim " + origClaimId + " completed incorrectly, skipped.");
		return;
	}
	
	print( claim.daysToDeadline + ' / ' + daysToDeadline + ' ' + claim.deadlineDate + ' / ' + deadlineDate);
	// Set deadline
     	var deadlineUpdate = db.claims.update(
		{
			"_id": claim._id
		},
		{
			$set:{
				"deadlineDate": deadlineDate, 
				"daysToDeadline": daysToDeadline
			}
		}
    );
    
    var mkuObject = {
    "id": null,
    "createDate": new Date(),
    "claimId": origClaimId,
    "statusDate": deadlineDate,
    "statusCode": "99",
    "senderCode": "RLDD"
    }

   // db.claims_status_mku.save(mkuObject);
    
    
	
	total += deadlineUpdate.nModified;
	print("I: " + iteration + ", SFU: " + total + "; hasResult: " + completed + "; DU/SU: " + deadlineUpdate.nModified + "/" + stagesUpdate.nModified + "; GUID: " + origClaimId + "; CCN: " + claim.customClaimNumber  + "; created: " + getActualDate(startDate) + "; deadlineDate: " + getActualDate(deadlineDate) + "; daysToDeadline: " + daysToDeadline);
});

print("Updated total: " + total + " claim(s).");