function getAge(date) {
    return ((new Date('2020-06-24').getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
}

db.persons.find({
  "dateOfBirth": {
    $exists: true
  }
}).addOption(DBQuery.Option.noTimeout).forEach(function (person) {
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
          if (address.regionPrefix != undefined) {
            addressObj.region = `${address.regionPrefix}. ${address.region}`;
          }
          if (address.areaPrefix != undefined) {
            addressObj.area = `${address.areaPrefix}. ${address.area}`;
          }
          if (address.localityPrefix != undefined) {
            addressObj.locality = `${address.localityPrefix}. ${address.locality}`;
          }
          if (address.streetPrefix != undefined) {
            addressObj.street = `${address.streetPrefix}. ${address.street}`;
          }
          for (var obj in addressObj) {
            if(addressObj[obj] == undefined) {
              delete addressObj[obj];
            } else {
              personData.address.push(addressObj[obj])
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
      for(var da in personData) {
        printString += personData[da]+';';
      }
      print(printString)
    } catch (err) {
      print(id, err)
    }
  }
});