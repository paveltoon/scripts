function checkRegex(date, id) {
  try {
    var isRegex = false;

    function regex0(regex) {
      return regexps[0].regex.exec(regex)[0]
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

    var regexps = [{
        'regex': /\d{4}-\d\d-\d\d/,
        'function': regex0,
      },
      {
        'regex': /\d\d-\D{3}-\d{4}/,
        'function': regex1,
      },
    ]

    for (var rx in regexps) {
      var reg = regexps[rx];
      if (reg.regex.test(date)) {
        isRegex = true;
        return reg.function(date);
      };
    }
    if (!isRegex) {
      throw new Error(`ID: ${id} Have no regex for "${date}" date.`)
    }
  } catch (e) {
    throw e
  }
}

function setRightDate(date, id) {
  try {
    if (typeof date == 'string') {
      if (date[0] == 0) {
        var n = date.split('');
        n[0] = 1;
        n[1] = 9;
        return n.join('')
      }

      if (+date[0] == 1 && +date[1] < 9) {
        var d = date.split('');
        d[0] = 1;
        d[1] = 9;
        return d.join('')
      }

      return date;
    } else {
      throw new Error(`ID: ${id} Date "${date}" is not "String".`)
    }
  } catch (e) {
    throw e;
  }

}

db.docs.find({ "fromDate": { $exists: true } }).forEach((doc) => {
  var docId = doc._id;
  var updater = {};
  try {
    var fromDate = doc.fromDate;
    var formatedFromDate = checkRegex(fromDate, docId);
    var newFromDate = setRightDate(formatedFromDate);
    updater["fromDate"] = newFromDate;
    var upd = db.docs.update({"_id": docId}, {$set: {updater}})
    print(`Doc ${docId} has been updated. Progress: ${upd.nModified} / ${upd.nMatched}`)
  } catch (e) {
    print(e)
  }
})