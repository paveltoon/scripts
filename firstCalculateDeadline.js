// Взять все deadlineStages
// Если нет стейджа, вытянуть из заявки и сформировать стейдж
// Проверить рабочие ли дни?
// Если рабочие - рассчитать дату по календарю
// Если нет - просто поставить в daysToDeadline

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

db.claims.find({}).limit(100).forEach((claim) => {
  var claimId = claim._id;
  var ccn = claim.customClaimNumber;
  var isStages = false;
  var isChanged = false;
  var updater = {};
  if (!("deadlineStages" in claim)) {
    if ("deadline" in claim && "deadlineInWorkDays" in claim) {
      var deadlineStages = [{
        "stageType": "REGULATION_TIME",
        "stageName": "Регламентный срок",
        "deadline": NumberInt(claim.deadline),
        "deadlineInWorkDays": claim.deadlineInWorkDays
      }];
      claim.deadlineStages = deadlineStages;
      updater["deadlineStages"] = deadlineStages;
      isStages = true;
      isChanged = true;
    }
  } else {
    isStages = true;
  }

  if (!isStages) {
    print("[ERROR] Can't set deadlineStages. Claim id: " + claimId);
    return;
  }
  
  var count = 0;
  var daysToDeadline = 0;
  var daysCheck = getDayOfYear(claim.claimCreate);
  var сalendar = getCalendar(claim.claimCreate.getFullYear());
  // Рассчет дней до дедлайна с учетом рабочих / календарных дней
  for (var st in claim.deadlineStages) {
    var stage = claim.deadlineStages[st]
    if (stage.deadlineInWorkDays) {
      while (count < stage.deadline) {
        // Если есть совпадеиние в календаре, значит выходной, плюсуем к дате, не плюсуем счетчик
        if (сalendar.indexOf(daysCheck) != -1) {
          daysCheck++;
          daysToDeadline++;
          // Иначе плюсуем счетчик
        } else {
          daysCheck++;
          daysToDeadline++;
          count++;
        }
        // Если дедлайн проходит новый год, с учетом високосного года
        if (daysCheck > getDayOfYear(new Date(claim.claimCreate.getFullYear(), 11, 31))) {
          daysCheck = 1;
          сalendar = getCalendar(claim.claimCreate.getFullYear() + 1);
        }
      }
    } else {
      daysToDeadline += stage.deadline;
    }
  }

  if (claim.claimCreate.getHours() >= 16) {
    daysToDeadline += 1;
  }

  // Рассчет первоначальной даты дедлайна
  var resultDate = new Date(claim.claimCreate);
  var newDeadlineDate = new Date(new Date(resultDate.setDate(resultDate.getDate() + daysToDeadline)).setHours(0, 0, 0, 0))


  print(newDeadlineDate)
  print(ccn, daysToDeadline)
})