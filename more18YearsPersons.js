function getId(id) {
  if (id.length == 24) {
    return ObjectId(id);
  } else {
    return id;
  }
}

function getAge(textDate) {
  var dateArr = textDate.split('-');
  var [year, month, day] = dateArr;
  var birth = new Date(+year, +month - 1, +day);
  return Math.floor((Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365))
}

function getAddress(adrId) {
  var data = []
  var address = db.addresses.findOne({
    "_id": adrId
  })
  if (address != undefined) {
    addressObj = {
      "country": address.country,
      "region": address.region,
      "area": address.area,
      "locality": address.locality,
      "street": address.street,
      "houseNumber": address.houseNumber,
      "corps": address.corps,
      "room": address.room,
    }
    if (address.regionPrefix != undefined && address.regionPrefix != '') {
      addressObj.region = `${address.region} ${address.regionPrefix}.`;
    }
    if (address.areaPrefix != undefined && address.areaPrefix != '') {
      addressObj.area = `${address.area} ${address.areaPrefix}.`;
    }
    if (address.localityPrefix != undefined && address.localityPrefix != '') {
      addressObj.locality = `${address.locality} ${address.localityPrefix}.`;
    }
    if (address.streetPrefix != undefined && address.streetPrefix != '') {
      addressObj.street = `${address.street} ${address.streetPrefix}.`;
    }
    for (var obj in addressObj) {
      if (addressObj[obj] == undefined || addressObj[obj].trim() == '') {
        delete addressObj[obj];
      } else {
        if (!data.length) {
          data.push(addressObj[obj])
        } else {
          data.push(' ' + addressObj[obj])
        }
      }
    }
  }

  return data;
}
var count = 0;
db.addresses.find({
    $or: [{
      "type": "ACTUAL"
    }, {
      "type": "REGISTRATION"
    }],
    "area": /^Талдом.*/i,
    "personId": {
      $exists: true
    }
  })
  .addOption(DBQuery.Option.noTimeout)
  .forEach((adr) => {
    if (count <= 0) {
      print("ФИО;Возраст;Пол;Паспорт серия;Паспорт номер;Email;Телефон;Снилс;Адрес регистрации;Адрес фактического проживания")
      count++;
    }

    var personId = getId(adr.personId);
    var person = db.persons.findOne({
      "_id": personId
    });

    if (person == undefined || person.dateOfBirth == undefined) {
      return;
    }

    var age = getAge(person.dateOfBirth)
    if (age < 18) {
      return;
    }
    var fio = `${person.surname || ''} ${person.firstName || ''} ${person.middleName || ''}`.trim();
    var gender = person.gender || '';

    // --- Passport ---
    var passSerial;
    var passNum;

    if ("currIdentityDoc" in person) {
      passSerial = person.currIdentityDoc.serial || '';
      passNum = person.currIdentityDoc.number || '';
    } else if ("currIdentityDocId" in person) {
      var doc = db.docs.findOne({
        "_id": getId(person.currIdentityDocId)
      })
      if (doc.serial != undefined || doc.number != undefined) {
        passSerial = doc.serial || '';
        passNum = doc.number || '';
      }
    } else {
      passSerial = '';
      passNum = '';
    }

    // --- Contacts ---
    var emails = [];
    var phones = [];

    if ("contacts" in person && person.contacts.length) {
      for (var c in person.contacts) {
        var con = person.contacts[c];
        if (con.type == "EML" || con.value.indexOf("@") != -1) {
          emails.push(con.value)
        } else {
          phones.push(con.value)
        }
      }
    }

    // --- Snils ---
    var snils = person.snils || '';

    // --- Address ---
    var regAdr = "registrationAddressId" in person ? getAddress(getId(person.registrationAddressId)) : '';
    var locAdr = "locationAddressId" in person ? getAddress(getId(person.locationAddressId)) : '';
   
    print(`${fio};${age};${gender};${passSerial};${passNum};${emails};${phones};${snils};${regAdr};${locAdr}`)
  })