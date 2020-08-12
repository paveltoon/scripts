db.claims.find({
  "service.srguServicePassportId": "5000000010000000897",
  "personsInfo.esiaAutorisation": true
}).forEach(claim => {
  var claimId = claim._id
  var ccn = claim.customClaimNumber;

  var personsInfo = claim.personsInfo
  var updater = {}
  for (var p in personsInfo) {
    var pers = personsInfo[p];
    if (pers.esiaAutorisation) {
      updater[`personsInfo.${p}.esiaAutorisation`] = false
    }
  }
  var upd = db.claims.update({
    "_id": claimId
  }, {
    $set: updater
  })
  print(`Claim ${ccn} has been updated. ${upd.nModified} / ${upd.nMatched}.`)
})