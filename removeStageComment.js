db.claims.find({
  "docSendDate": {
    $gte: ISODate("2020-03-11T21:00:00.000+0000"),
    $lte: ISODate("2020-08-02T21:00:00.000+0000")
  },
  "daysToDeadline": {
    $lt: NumberInt(0)
  },
  "deadlineDate": {
    $gte: ISODate("2020-03-11T21:00:00.000+0000")
  }
}).limit(1).forEach(claim => {
  var claimId = claim._id
  var ccn = claim.customClaimNumber;
  var deadlineStages = claim.deadlineStages;
  for (var i in deadlineStages) {
    var stage = deadlineStages[i];
    stage.deadline = NumberInt(stage.deadline)
    if (stage.comment === "EISOUSUP-6044") {
      deadlineStages.splice(i, 1)
    }
  }
  var upd = db.claims.update({"_id": claimId}, {$set: {"deadlineStages": deadlineStages}})
  print(`Claim ${ccn} has been updated. Progress: ${upd.nModified} / ${upd.nMatched}`)
})