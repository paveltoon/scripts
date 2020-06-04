var taskNum = "PGUSVC-3388"
var newDeadlineDate = new Date(2020, 7, 31);

db.claims.find({
  "service.srguServicePassportId": "5000000000189808193",
  "claimCreate": {
    $gte: ISODate("2020-05-31T21:00:00.000+0000")
  }
}).forEach((claim) => {
  var ccn = claim.customClaimNumber;
  var id = claim._id;
  try {

    var newDaysToDeadline = Math.floor((newDeadlineDate - new Date()) / (1000 * 60 * 60 * 24))
    var deadlineStages = claim.deadlineStages;

    var stagesDays = claim.daysToDeadline;

    var diffDeadline = newDaysToDeadline - stagesDays;

    var newStage = {
      "stageType": "DEADLINE_TRANSFER",
      "stageName": "Корректировка срока",
      "comment": taskNum,
      "deadline": diffDeadline,
      "deadlineInWorkDays": false
    }
    deadlineStages.push(newStage)
    for (var ds in deadlineStages) {
      var stage = deadlineStages[ds];
      stage.deadline = NumberInt(stage.deadline)
    }
    var upd = db.claims.update({
      "_id": id
    }, {
      $set: {
        "deadlineDate": newDeadlineDate,
        "daysToDeadline": NumberInt(newDaysToDeadline),
        "deadlineStages": deadlineStages
      }
    })
    print(`Claim ${ccn} has been updated. Progress: ${upd.nModified} / ${upd.nMatched}`)
  } catch (e) {
    print(ccn, e)
  }


})