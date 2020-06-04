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

db.persons.find({
  $or: [{
    "dateOfBirth": /^1.*/i
  }, {
    "currIdentityDoc.fromDate": /^1.*/i
  }, {
    "dateOfBirth": /^0.*/i
  }, {
    "currIdentityDoc.fromDate": /^0.*/i
  }]
}).forEach((person) => {
  try {
    var id = person._id;
    var updater = {};
    if (person.dateOfBirth != undefined) {
      var formatedBirthDate = checkRegex(person.dateOfBirth, id)
      var newDate = setRightDate(formatedBirthDate, id)
      updater['dateOfBirth'] = newDate;
    }

    if (person.currIdentityDoc != undefined && person.currIdentityDoc.fromDate != undefined) {
      var formatedFromDate = checkRegex(person.currIdentityDoc.fromDate, id)
      var newFromDate = setRightDate(formatedFromDate, id)

      updater['currIdentityDoc.fromDate'] = newFromDate;
    }
    var upd = db.persons.update({"_id": id}, {$set: updater})
    print(`Person ${id} has been updated. Progress: ${upd.nModified} / ${upd.nMatched}.`)
  } catch (e) {
    print(e)
  }
})