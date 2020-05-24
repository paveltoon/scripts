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
var base = 'persons';
var str = 'dateOfBirth';
var findQuery = {
  "lastModified": {
    $gte: ISODate("2019-01-01T00:00:00.000+0000")
  }
};
findQuery[str] = {
  $exists: true
};
var total = db.getCollection(base).find(findQuery).count();
var current = 0;
var corrected = 0;
var fromDateCorrect = 0;
var bulk = db.persons.initializeUnorderedBulkOp();
var bulkResult = {
  modified: 0,
  matched: 0,
}

db.getCollection(base).find(findQuery).addOption(DBQuery.Option.noTimeout).forEach(function (doc) {
  var progress = Math.round((current / total) * 100);
  var id = doc._id;
  var dateOfBirth = doc[str] instanceof Date ? getActualDate() : doc[str].toString();
  if (dateOfBirth.trim() == '') {
    return;
  }
  var regexMatched = false;

  var updateData = {}

  if (doc.currIdentityDoc != undefined && doc.currIdentityDoc.fromDate != undefined) {
    var fromDate = doc.currIdentityDoc.fromDate instanceof Date ? getActualDate(doc.currIdentityDoc.fromDate) : doc.currIdentityDoc.fromDate.toString();
    for (var j in Regexps) {
      var reg = Regexps[j];
      if (reg.regex.test(fromDate)) {
        updateData[str] = reg.function(fromDate);
        regexMatched = true;
        fromDateCorrect ++;
      };
    }
  }

  for (var i in Regexps) {
    var reg = Regexps[i];
    if (reg.regex.test(dateOfBirth)) {
      updateData[str] = reg.function(dateOfBirth);
      regexMatched = true;
    };
  }
  if (regexMatched == true) {
    current++;
    print(updateData[str])
    print(dateOfBirth)
    //Update & print
    bulk.find({
      "_id": id
    }).update({
      $set: updateData
    })
    print(`${id} has been updated. ${progress}%`)
    corrected++;

    if (current % 1000 == 0) {
      var upd = bulk.execute();
      bulkResult.modified += upd.nModified;
      bulkResult.matched += upd.nMatched;
      bulk = db.persons.initializeUnorderedBulkOp();
    }
  } else {
    current++;
    print(`[WARNING] ID: ${id.valueOf()}, String '${str}' with value '${dateOfBirth}' don't have the right regex.`)
  }
});
upd = bulk.execute();
bulkResult.modified += upd.nModified;
bulkResult.matched += upd.nMatched;
print(`DONE: ${ bulkResult.modified } / ${ bulkResult.matched }`);