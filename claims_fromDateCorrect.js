function getActualDate(date) {
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return (year + '-' + month + '-' + dt);
};

function regex0(regex) {
  return Regexps[0].regex.exec(regex)[0]
}

function regex1(regex) {
  n = regex.split('-')
  months = {
    'янв': '01',
    'фев': '02',
    'мар': '03',
    'апр': '04',
    'май': '05',
    'мая': '05',
    'июн': '06',
    'июл': '07',
    'авг': '08',
    'сен': '09',
    'окт': '10',
    'ноя': '11',
    'дек': '12'
  }
  return `${n[2]}-${months[n[1]]}-${n[0]}`
}

var Regexps = [{
    'regex': /\d{4}-\d\d-\d\d/,
    'function': regex0,
  },
  {
    'regex': /\d\d-\D{3}-\d{4}/,
    'function': regex1,
  },
]
var base = 'claims';
var findQuery = {
  "personsInfo": {
    $exists: true
  },
  "claimCreate": {
    $gte: ISODate("2020-01-01T00:00:00+0300")
  }
};
var total = db.getCollection(base).find(findQuery).count();
var current = 0;
var corrected = 0;
var fromDateCorrect = 0;
var bulk = db.claims.initializeUnorderedBulkOp();
var bulkResult = {
  modified: 0,
  matched: 0,
}

db.getCollection(base).find(findQuery).addOption(DBQuery.Option.noTimeout).forEach(function (claim) {
  current++;
  var progress = Math.round((current / total) * 100);
  var id = claim._id;
  var updateData = {};
  var regexMatched = false;
  // --- Persons Info ---
  if (claim.personsInfo != undefined && claim.personsInfo.length) {

    for (var i in claim.personsInfo) {
      var person = claim.personsInfo[i];

      if (person.dateOfBirth != undefined) {
        var dateOfBirth = person.dateOfBirth instanceof Date ? getActualDate(person.dateOfBirth) : person.dateOfBirth;

        for (var j in Regexps) {
          var reg = Regexps[j];

          if (reg.regex.test(dateOfBirth)) {
            updateData[`personsInfo.${i}.dateOfBirth`] = reg.function(dateOfBirth);
            regexMatched = true;
          }
        }
      }

      if (person.currIdentityDoc != undefined && person.currIdentityDoc.fromDate != undefined) {
        var fromDate = person.currIdentityDoc.fromDate instanceof Date ? getActualDate(person.currIdentityDoc.fromDate) : person.currIdentityDoc.fromDate;

        for (var z in Regexps) {
          var reg = Regexps[z];

          if (reg.regex.test(fromDate)) {
            updateData[`personsInfo.${i}.currIdentityDoc.fromDate`] = reg.function(fromDate);
            regexMatched = true;
          }
        }
      }
    }
  }
  // --- Trusted Persons ---
  if (claim.trustedPersons != undefined && claim.trustedPersons.length) {

    for (var p in claim.trustedPersons) {
      var tPerson = claim.trustedPersons[p].trustedPerson.trustedPersonInfo;

      if (tPerson.dateOfBirth != undefined) {
        var dateOfBirth = tPerson.dateOfBirth instanceof Date ? getActualDate(tPerson.dateOfBirth) : tPerson.dateOfBirth;

        for (var k in Regexps) {
          var reg = Regexps[k];

          if (reg.regex.test(dateOfBirth)) {
            updateData[`trustedPersons.${p}.trustedPerson.trustedPersonInfo.dateOfBirth`] = reg.function(dateOfBirth);
            regexMatched = true;
          }
        }
      }

      if (tPerson.currIdentityDoc != undefined && tPerson.currIdentityDoc.fromDate != undefined) {
        var fromDate = tPerson.currIdentityDoc.fromDate instanceof Date ? getActualDate(tPerson.currIdentityDoc.fromDate) : tPerson.currIdentityDoc.fromDate;

        for (var v in Regexps) {
          var reg = Regexps[v];

          if (reg.regex.test(fromDate)) {
            updateData[`trustedPersons.${p}.trustedPerson.trustedPersonInfo.currIdentityDoc.fromDate`] = reg.function(fromDate);
            regexMatched = true;
          }
        }
      }
    }
  }

  if (regexMatched) {
    corrected++;
    bulk.find({
      "_id": id
    }).update({
      $set: updateData
    });
    print(`${id} has been updated. ${progress}%`)
  }

  if (current % 1000 == 0) {
    var upd = bulk.execute();
    bulkResult.modified += upd.nModified;
    bulkResult.matched += upd.nMatched;
    bulk = db.claims.initializeUnorderedBulkOp();
  }

});

upd = bulk.execute();
bulkResult.modified += upd.nModified;
bulkResult.matched += upd.nMatched;
print(`Corrected: ${corrected} Current: ${current} Total: ${total}`)
print(`DONE: ${ bulkResult.modified } / ${ bulkResult.matched }`);