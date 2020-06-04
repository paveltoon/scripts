var personsArr = [
  ObjectId("594a5044a78eb7f8e074723c")
]
var unsetVars = ['surname', 'firstName', 'middleName', 'lowerCaseSurname', 'lowerCaseFirstName', 'lowerCaseMiddleName'];
db.claims.find({
  "personsInfo._id": {
    $in: personsArr
  },
  "resultStatus": {
    $exists: false
  },
  "senderCode": "IPGU01001"
}).forEach(function (claim) {
  var id = claim._id;
  var ccn = claim.customClaimNumber;
  var updateObj = {};
  if (claim.personsInfo != undefined && claim.personsInfo.length) {
    for (var i in claim.personsInfo) {
      var person = claim.personsInfo[i];
      var personId = person._id;
      if (personsArr.indexOf(personId)) {
        var updStr = `personsInfo.${i}.`
        for (var j in unsetVars) {
          updateObj[updStr + unsetVars[j]] = '';
        }
      }
    }
  }

  var upd = db.claims.update({
    "_id": id
  }, {
    $unset: updateObj
  });
  print(`${ccn} has been updated. Progress: ${upd.nModified} / ${upd.nMatched}`);
})

var unsetPersonData = {};
for (var uv in unsetVars) {
  unsetPersonData[unsetVars[uv]] = '';
}
var updP = db.persons.update({
  "_id": {
    $in: personsArr
  }
}, {
  $unset: unsetPersonData
}, {
  multi: true
});
print(`Persons has been updated ${updP.nModified} / ${updP.nMatched}`)