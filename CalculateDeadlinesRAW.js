// Номер таска ставится в deadlineStages
var taskNum = "EISOUSUP-5954"

// Объект поиска
var query = { "customClaimNumber": { $in: ['P001-1671237104-36473454', 'M503-0344976186-24963847'] } }
//var query = { "customClaimNumber": "P001-1671237104-36473454" }
// Блок функций
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

function getDeadlineStages(claim) {
  var isStages = false;
  var deadlineStages = []

  if (!("deadlineStages" in claim)) {

    if ("deadline" in claim && "deadlineInWorkDays" in claim) {
      deadlineStages = [{
        "stageType": "REGULATION_TIME",
        "stageName": "Регламентный срок",
        "deadline": NumberInt(claim.deadline),
        "deadlineInWorkDays": claim.deadlineInWorkDays
      }];
      isStages = true;
    } else {
      return {
        deadlineStages,
        isStages
      }
    }

  } else {
    deadlineStages = claim.deadlineStages;
    isStages = true;
  }

  for (var sta in deadlineStages) {
    var stage = deadlineStages[sta]
    stage.deadline = NumberInt(stage.deadline)
  }

  return {
    deadlineStages,
    isStages
  }
}

function daysToDeadlineCalc(claim, deadlineStages) {
  var daysToDeadline = 0;
  var workDays = 0;
  var calDays = 0
  var deadlineTransfer = false


  // Рассчет дней до дедлайна с учетом рабочих / календарных дней
  for (var st in deadlineStages) {
    // Проверка переноса срока
    var stage = deadlineStages[st]
    if (stage.stageType == "DEADLINE_TRANSFER") {
      deadlineTransfer = true
    }
    // Добавление дней в переменные
    if (stage.deadlineInWorkDays) {
      workDays += stage.deadline
      print('workdays', workDays)
    } else {
      calDays += stage.deadline
      print('calDays', calDays)
    }
  }

  if (workDays > 0) {
    daysToDeadline += calculateWorkDays(claim.claimCreate, workDays)
  }
  daysToDeadline += calDays;
  if (claim.claimCreate.getHours() >= 16 && !deadlineTransfer) {
    daysToDeadline++;
  }
  print(daysToDeadline)
  return daysToDeadline;
}
// Расчет рабочих дней
function calculateWorkDays(date, workDays) {
  var count = 0;
  var daysCheck = getDayOfYear(date);
  var сalendar = getCalendar(date.getFullYear());
  var daysToDeadline = 0;
  while (count < workDays) {
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
    if (daysCheck > getDayOfYear(new Date(date.getFullYear(), 11, 31))) {
      daysCheck = 1;
      сalendar = getCalendar(date.getFullYear() + 1);
    }
  }
  return daysToDeadline;
}
// Если выпадает последний день исполнения на выходной
function transferHoliday(date) {
  holidayStatus = {
    changed: false,
    daysToDeadline: 0,
    deadlineDate: null
  }

  var daysCheck = getDayOfYear(date);

}
// Блок исполняющего кода
db.claims.find(query).addOption(DBQuery.Option.noTimeout).limit(10).forEach((claim) => {
  var claimId = claim._id;
  var ccn = claim.customClaimNumber;
  var updater = {};
  if (!("claimCreate" in claim)) {
    print(`[ERROR] Claim ${ccn} have no claimCreate date. skipped.`)
    return;
  }
  var Stages = getDeadlineStages(claim)
  var deadlineStages = Stages.deadlineStages;
  var isStages = Stages.isStages;
  // Если deadlineStages отсутствует
  if (!isStages) {
    print("[ERROR] Can't set deadlineStages. Claim id: " + claimId);
    return;
  }
  // Рассчет Days to Deadline
  var daysToDeadline = daysToDeadlineCalc(claim, deadlineStages)
  if (daysToDeadline <= 0) {
    print(`[ERROR] Claim ${ccn} has wrong daysToDeadline < 0. skipped`)
  }
  // Рассчет первоначальной даты дедлайна
  var resultDate = new Date(claim.claimCreate);
  var deadlineDate = new Date(new Date(resultDate.setDate(resultDate.getDate() + daysToDeadline)).setHours(0, 0, 0, 0))

  // Если последний день выпадает на выходной, необходимо перенести на первый рабочий
  print(ccn, daysToDeadline, deadlineDate)

  
  // Апдейт и принт
  /*   var upd = db.claims.update({
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

    print(`Claim ${ccn} has been corected. New DeadlineDate: ${newToSetDeadlineDate.toISOString()}, daysToDeadline: ${newDaysToDeadline}. Progress: ${upd.nModified} / ${upd.nMatched}`) */
})