function getAge(date) {
    return ((new Date('2020-06-24').getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
}
print('Фамилия;Имя;Отчество;Паспорт серия;Пасопрт номер;СНИЛС;Адрес;Дата рождения;Телефон;Email')
db.persons.find({
  "dateOfBirth": {
    $exists: true
  }
}).addOption(DBQuery.Option.noTimeout).limit(160000).forEach(function (person) {
  var id = person._id;
  var age = getAge(person.dateOfBirth);
  if (age >= 65 && age < 160) {
    try {
      // --- Finally print Obj ---
      personData = {
        surname:'',
        firstName: '',
        middleName: '',
        passportSerial: '',
        passportNumber: '',
        snils: '',
        address: [],
        birthDate: person.dateOfBirth,
        phones: [],
        emails: [],
      };
      // --- FIO ---
      personData.surname = person.surname;
      personData.firstName = person.firstName;
      if (person.middleName != undefined) {
        personData.middleName = person.middleName;
      }
      // --- Passport ---
      if (person.currIdentityDoc != undefined) {
        var pd = person.currIdentityDoc;
        personData.passportSerial = pd.serial;
        personData.passportNumber = pd.number;
      } else if (person.currIdentityDocId != undefined) {
        var pdi = person.currIdentityDocId.length == 24 ? ObjectId(person.currIdentityDocId) : person.currIdentityDocId;
        var doc = db.docs.findOne({"_id": pdi})
        if (doc != undefined) {
          personData.passportSerial = doc.serial;
          personData.passportNumber = doc.number;
        }
      }
      // --- Snils ---
      if (person.snils != undefined) {
        personData.snils = person.snils;
      }
      // --- Address ---
      if (person.registrationAddressId != undefined) {
        var adr = person.registrationAddressId.length == 24 ? ObjectId(person.registrationAddressId) : person.registrationAddressId;
        var address = db.addresses.findOne({"_id": adr})
        if (address != undefined) {
          addressObj = {
            "country": address.country,
            "region": address.region,
            "area": address.area,
            "locality":address.locality,
            "street": address.street,
            "houseNumber": address.houseNumber,
            "corps": address.corps,
            "room": address.room
          }
          if (address.regionPrefix != undefined && address.regionPrefix != '') {
            addressObj.region = `${address.region} ${address.regionPrefix}.`;
          }
          if (address.areaPrefix != undefined  && address.areaPrefix != '') {
            addressObj.area = `${address.area} ${address.areaPrefix}.`;
          }
          if (address.localityPrefix != undefined  && address.localityPrefix != '') {
            addressObj.locality = `${address.locality} ${address.localityPrefix}.`;
          }
          if (address.streetPrefix != undefined  && address.streetPrefix != '') {
            addressObj.street = `${address.street} ${address.streetPrefix}.`;
          }
          for (var obj in addressObj) {
            if(addressObj[obj] == undefined) {
              delete addressObj[obj];
            } else {
              if (!personData.address.length) {
                personData.address.push(addressObj[obj])
              } else {
                personData.address.push(' ' + addressObj[obj])
              }
            }
          }
        }
      }
      // --- Contacts ---
      if (person.contacts != undefined && person.contacts.length) {
        for (var i in person.contacts) {
          var contact = person.contacts[i];
          if (contact.type == 'EML' && contact.value != ''.trim()) {
            personData.emails.push(contact.value); 
          } else if (contact.value != ''.trim()){
            personData.phones.push(contact.value); 
          }
        }
      }
      // --- Full print ---
      printString = '';
      for (var it in personData) {
        if (personData[it] == undefined) {
          personData[it] = '';
        }
      }
      for(var da in personData) {
        printString += personData[da].toString().trim() + ';';
      }
      printString = printString.slice(0,-1);
      print(printString);
    } catch (err) {
      print(id, err)
    }
  }
});