function getId(id) {
  if (id.length == 24) {
    return ObjectId(id);
  } else {
    return id;
  }
}

var total = db.persons.find({
  "technicalProperties.type": "GOLD"
}).count()
var current = 0;

var bulk = db.persons.initializeUnorderedBulkOp();

db.persons.find({
  "technicalProperties.type": "GOLD"
}).addOption(DBQuery.Option.noTimeout).forEach((person) => {
  current++;
  if (current % 1000 == 0) {
    bulk.execute();
    bulk = db.persons.initializeUnorderedBulkOp();
  }
  print(`${current} / ${total}`)
  var personId = person._id;
  var commonPersons = person.technicalProperties.references.common;
  // Массив для поиска персон
  var commonPersonsArr = [];

  for (var cp in commonPersons) {
    var persId = commonPersons[cp]
    commonPersonsArr.push(getId(persId))
  }

  // Поиск персон
  var prodPersons = db.persons.find({
    "_id": {
      $in: commonPersonsArr
    }
  }).sort({
    "lastModified": -1
  }).toArray()

  if (person.firstName == undefined || person.firstName.trim() == '') {
    // Апдейт персоны DPS, ставим флаг, если отсутствует Имя.
    bulk.find({
      "_id": personId
    }).update({
      $set: {
        "needToResearch": true
      }
    })
    print(`Person ${personId} have no firstName.`)
    return;
  }

  // Проверка даты рождения в персоне
  if (person.dateOfBirth == undefined) {

    // Поиск common пользователей на проде
    if (commonPersonsArr.length > 0) {
      // Проверка на совпадение даты дня рождения
      var birthFinded = false;
      var birth = null;
      for (var ppd in prodPersons) {
        var pers = prodPersons[ppd]
        if (pers.dateOfBirth != undefined) {
          // Записываем в переменную значение даты рождения для сравнения
          if (birth == null) {
            birth = pers.dateOfBirth
            birthFinded = true;
          } else {
            // Если первая персона по дате рождения не сходится со второй, выбрасываем из цикла
            if (birth != pers.dateOfBirth) {
              birthFinded = false;
              bulk.find({
                "_id": personId
              }).update({
                $set: {
                  "needToResearch": true
                }
              })
              print(`Person ${personId} have different birthdays.`)
              break;

            } else {
              birthFinded = true;
            }
          }
        }
      }
      // Если дата найдена и совпадает, обогащаем персону
      if (birthFinded) {
        bulk.find({
          "_id": personId
        }).update({
          $set: {
            "dateOfBirth": birth
          }
        })
        print(`Birthday has been added in person ${personId}.`)
      } else {
        return;
      }
    }

  }

  var result = {
    emails: 0,
    phones: 0
  }

  // Проверка контактов
  if (person.contacts != undefined) {
    var contacts = person.contacts
    for (var c in contacts) {
      var contact = contacts[c];
      contact.type == "EML" ?
        result.emails++
        :
        contact.type == "MBT" ?
        result.phones++
        :
        null;
    }
  }
  // Если в персоне отсутствют номера телефонов
  if (result.phones == 0) {

    // Существующий массив контактов
    if (commonPersonsArr.length > 0) {
      // Поиск персон на проде
      var phoneFound = false;

      for (var ppp in prodPersons) {
        // Проверка был ли найден телефон
        if (phoneFound) {
          break;
        }

        var per = prodPersons[ppp];
        // Если есть контакты, ищем MBT и апдейтим персону DPS
        if (per.contacts != undefined && per.contacts.length > 0) {
          for (var pc in per.contacts) {
            var con = per.contacts[pc];
            if (con.type == "MBT") {
              phoneFound = true;
              bulk.find({
                "_id": personId
              }).update({
                $push: {
                  "contacts": con
                }
              })
              print(`Phone has been added to person ${personId}.`)
              break;
            }
          }
        }
      }
      
      if (!phoneFound) {
        bulk.find({
          "_id": personId
        }).update({
          $set: {
            "needToResearch": true
          }
        });

        print(`Phone does not found in person ${personId}.`);
      }
    }
  }

  // Проверка emails
  if (result.emails == 0) {

    // Существующий массив контактов
    if (commonPersonsArr.length > 0) {
      // Поиск персон на проде
      

      var emailFound = false;

      for (var ppe in prodPersons) {
        // Проверка был ли найден email
        if (emailFound) {
          break;
        }

        var ePers = prodPersons[ppe];
        // Если есть контакты, ищем MBT и апдейтим персону DPS
        if (ePers.contacts != undefined && ePers.contacts.length > 0) {
          for (var ec in ePers.contacts) {
            var eCon = ePers.contacts[ec];
            if (eCon.type == "EML") {
              emailFound = true;
              bulk.find({
                "_id": personId
              }).update({
                $push: {
                  "contacts": eCon
                }
              })
              print(`Email has been added to person ${personId}.`)
              break;
            }
          }
        }
      }
      
      if (!emailFound) {
        bulk.find({
          "_id": personId
        }).update({
          $set: {
            "needToResearch": true
          }
        });
        print(`Email does not found in person ${personId}.`);
      }
    }
  }
})
bulk.execute();