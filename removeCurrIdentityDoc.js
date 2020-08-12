db.claims.find({
  "customClaimNumber": {
    $in: [
      "P001-7887436388-35654323",
      "P001-3350064957-35656093",
      "P001-2423847630-35681740",
      "P001-4840029923-35683925",
      "P001-3310032812-35686277",
      "P001-3350064957-35686185",
      "P001-3350064957-35685625",
      "P001-1411654361-35686606",
      "P001-3442822725-35694433",
      "P001-9736589602-35680164"
    ]
  }
}).forEach(claim => {
  var claimId = claim._id;
  var ccn = claim.customClaimNumber;
  var personsInfo = claim.personsInfo;
  for (var p in personsInfo) {
    var claimPerson = personsInfo[p]
    var personId = claimPerson._id;

    var person = db.persons.findOne({
      "_id": personId
    });
    if (person != undefined) {
      if ("currIdentityDoc" in person) {
        var prUpd = db.persons.update({
          "_id": personId
        }, {
          $unset: {
            "currIdentityDoc": ""
          }
        })
        print(`Person ${personId} has been updated. Progress: ${prUpd.nModified} / ${prUpd.nMatched}`)
      }
    }
    if ("currIdentityDoc" in claimPerson) {
      var unsetter = {}
      unsetter[`personsInfo.${p}.currIdentityDoc`] = ""
      var clUpd = db.claims.update({
        "_id": claimId
      }, {
        $unset: unsetter
      });
      print(`Claim ${ccn} has been updated. Progress: ${clUpd.nModified} / ${clUpd.nMatched}`)
    }
  }
});