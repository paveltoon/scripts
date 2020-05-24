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
var base = 'docs';
var str = 'fromDate';
var findQuery = {
  "createDate": {
    $gte: ISODate("2019-12-31T21:00:00.000+0000")
  }
};
findQuery[str] = {
  $exists: true
};
var total = db.getCollection(base).find(findQuery).count();
var current = 0;
var corrected = 0;
var bulk = db.docs.initializeUnorderedBulkOp();
var bulkResult = {
  modified: 0,
  matched: 0,
}

db.getCollection(base).find(findQuery).addOption(DBQuery.Option.noTimeout).forEach(function (doc) {
  var progress = Math.round((current / total) * 100);
  var id = doc._id;
  var fromDate = doc[str] instanceof Date ? getActualDate(doc[str]) : doc[str].toString();
  if (fromDate.trim() == '') {
    return;
  }
  var regexMatched = false;

  var updateData = {}
  for (var i in Regexps) {
    var reg = Regexps[i];
    if (reg.regex.test(fromDate)) {
      updateData[str] = reg.function(fromDate);
      regexMatched = true;
    };
  }
  if (regexMatched == true) {
    current++;
    print(updateData[str])
    print(fromDate)
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
      bulk = db.docs.initializeUnorderedBulkOp();
    }
  } else {
    current++;
    print(`[WARNING] ID: ${id.valueOf()}, String '${str}' with value '${fromDate}' don't have the right regex.`)
  }
});
upd = bulk.execute();
bulkResult.modified += upd.nModified;
bulkResult.matched += upd.nMatched;
print(`${ bulkResult.modified } / ${ bulkResult.matched }`)
print("Done " + bulkResult.modified + " : " + total);