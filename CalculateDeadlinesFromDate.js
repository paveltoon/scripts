// Номер таска ставится в deadlineStages
var taskNum = "EISOUSUP-6044"

// Установка необходимой даты дедлайна
var newToSetDeadlineDate = new Date(2020, 7, 30);
var query = {
  "resultStatus": {
    $exists: true
  },
  "docSendDate": {
    $gte: ISODate("2020-03-11T21:00:00.000+0000"),
    $lte: ISODate("2020-08-29T21:00:00.000+0000")
  },
  "deadlineDate": {
    $gte: ISODate("2020-03-11T21:00:00.000+0000")
  },
  "daysToDeadline": {
    $lt: NumberInt(25)
  }
}

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

db.claims.find(query).addOption(DBQuery.Option.noTimeout).forEach((claim) => {
  var claimId = claim._id;
  var ccn = claim.customClaimNumber;
  var isStages = false;
  var updater = {};
  var deadlineStages;
  if (!("deadlineStages" in claim)) {
    if ("deadline" in claim && "deadlineInWorkDays" in claim) {
      deadlineStages = [{
        "stageType": "REGULATION_TIME",
        "stageName": "Регламентный срок",
        "deadline": NumberInt(claim.deadline),
        "deadlineInWorkDays": claim.deadlineInWorkDays
      }];
      claim.deadlineStages = deadlineStages;
      isStages = true;
    }
  } else {
    deadlineStages = claim.deadlineStages;
    isStages = true;

    for (var i in deadlineStages) {
      if (deadlineStages[i].comment === taskNum) {
        print(`Claim ${ccn} already updated.`);
        return;
      }
    }

  }

  if (!isStages) {
    print("[ERROR] Can't set deadlineStages. Claim id: " + claimId);
    return;
  }
  // ----------------------------------------------------
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
  var deadlineDate = new Date(new Date(resultDate.setDate(resultDate.getDate() + daysToDeadline)).setHours(0, 0, 0, 0))

  // Рассчет разницы в днях для добавления нового стейджа
  var diffDays = Math.round((newToSetDeadlineDate - deadlineDate) / (1000 * 60 * 60 * 24))
  var newStage = {
    "stageType": "DEADLINE_TRANSFER",
    "stageName": "Корректировка срока",
    "comment": taskNum,
    "deadline": diffDays,
    "deadlineInWorkDays": false
  }
  deadlineStages.push(newStage)
  for (var s in deadlineStages) {
    deadlineStages[s].deadline = NumberInt(deadlineStages[s].deadline)
    if (deadlineStages[s].deadline == 0) {
      deadlineStages.splice(s, 1)
      s -= 1
    }
  }

  // Установка дней до дедлайна относительно нужной даты
  var newDaysToDeadline = ((newToSetDeadlineDate - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));


  updater = {
    "deadlineStages": deadlineStages,
    "daysToDeadline": NumberInt(newDaysToDeadline),
    "deadlineDate": newToSetDeadlineDate
  }

  // Апдейт и принт
  var upd = db.claims.update({
    "_id": claimId
  }, {
    $set: updater
  })

  var mkuObject = {
    "id": null,
    "createDate": new Date(),
    "claimId": claimId,
    "statusDate": newToSetDeadlineDate,
    "statusCode": "99",
    "senderCode": "RLDD"
  }

  db.claims_status_mku.save(mkuObject);

  print(`Claim ${ccn} has been corected. New DeadlineDate: ${newToSetDeadlineDate.toLocaleDateString()}, daysToDeadline: ${newDaysToDeadline}. Progress: ${upd.nModified} / ${upd.nMatched}`)
})