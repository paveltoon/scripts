db.persons.find({
  "type": {
    $exists: false
  },
  "snils": {
    $exists: true
  }
}).forEach(function (person) {
  var personId = person._id;
  var snils = person.snils;

  var samePerson = db.persons.findOne({
    "snils": snils,
    "type": "PHYSICAL"
  });

  if (samePerson != undefined) {
    claims = db.claims.find({
      "persons": personId.valueOf()
    }).toArray();

    if (claims.length) {
      for (var cl in claims) {
        var claim = claims[cl];
        var claimId = claim._id;
        var ccn = claim.customClaimNumber;
        var updater = {};
        var claimPersons = claim.persons;

        for (var cp in claimPersons) {
          var oldPers = claimPersons[cp];
          if (oldPers == personId.valueOf()) {
            updater[`persons.${cp}`] = samePerson._id.valueOf();
            var updC = db.claims.update({
              "_id": claimId
            }, {
              $set: updater
            })
            print(`Claim ${ccn} has been corrected. Progress: ${updC.nModified} / ${updC.nMatched}`);
          }
        }
      }
    }
    db.xxx_persons_backup_2020.insert(person)
    var remPers = db.persons.remove({
      "_id": personId
    }, true);
    print(`Person ${personId.valueOf()} has been removed. Progress: ${remPers.nRemoved}`)

  } else {
    var updP = db.persons.update({
      "_id": personId
    }, {
      $set: {
        "type": "PHYSICAL"
      }
    })

    print(`Person ${personId.valueOf()} has been updated. Progress: ${updP.nModified} / ${updP.nMatched}`)
  }
})