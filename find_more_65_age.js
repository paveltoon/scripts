function getAge(date) {
    return ((new Date('2020-06-24').getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
}

db.persons.find({
  "dateOfBirth": {
    $exists: true
  }
}).addOption(DBQuery.Option.noTimeout).limit(10).forEach(function (person) {
  var id = person._id;
  var age = getAge(person.dateOfBirth);
  if (age >= 65 && age < 160) {
    try {
      // --- Finally print Obj ---
      personData = {
        fio:'',
        passport: '',
        address: [],
        birthDate: person.dateOfBirth,
        contacts: [],
      };
      // --- Variables ---
      var surname = person.surname;
      var firstName = person.firstName;
      var middleName = '';
      if (person.middleName != undefined) {
        middleName = person.middleName;
      }
      // --- FIO ---
      personData.fio = `${surname} ${firstName} ${middleName}`;
      // --- Passport ---
      if (person.currIdentityDoc != undefined) {
        var pd = person.currIdentityDoc;
        personData.passport = `${pd.serial} ${pd.number}`
      } else if (person.currIdentityDocId != undefined) {
        var pdi = person.currIdentityDocId.length == 24 ? ObjectId(person.currIdentityDocId) : person.currIdentityDocId;
        var doc = db.docs.findOne({"_id": pdi})
        if (doc != undefined) {
          personData.passport = `${doc.serial} ${doc.number}`
        }
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
            "street": address.street,
            "houseNumber": address.houseNumber,
            "corps": address.corps,
            "room": address.room
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
          if (contact.value != ''.trim()) {
            personData.contacts.push(contact.value); 
          }
        }
      }
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