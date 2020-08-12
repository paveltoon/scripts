var result = {
  surname: 0,
  firstName: 0,
  middleName: 0,
  gender: 0,
  dateOfBirth: 0,
  registrationAddressId: 0,
  emails: 0,
  phones: 0,
  docType: 0,
  docSerial: 0,
  docNumber: 0,
  docIssueDate: 0
}
db.persons.find({
  "technicalProperties.type": "GOLD"
}).forEach((person) => {
  person.surname != undefined && person.surname.trim() != '' ? result.surname++ : null;
  person.firstName != undefined && person.firstName.trim() != '' ? result.firstName++ : null;
  person.middleName != undefined && person.middleName.trim() != '' ? result.middleName++ : null;
  person.gender != undefined && person.gender.trim() != '' ? result.gender++ : null;
  person.dateOfBirth != undefined && person.dateOfBirth.trim() != '' ? result.dateOfBirth++ : null;
  person.registrationAddressId != undefined && person.registrationAddressId.trim() != '' ? result.registrationAddressId++ : null;

  if (person.contacts != undefined) {
    var contacts = person.contacts
    for (var c in contacts) {
      var contact = contacts[c];
      contact.type == "EML" ? result.emails++ : result.phones++
    }
  }

  if (person.identityDocuments != undefined) {
    var identityDocuments = person.identityDocuments
    for (var d in identityDocuments) {
      var doc = identityDocuments[d]
      if (doc.actual && doc.type == "PASSPORT") {
        doc.type != undefined && doc.type.trim() != '' ? result.docType++ : null;
        doc.serial != undefined && doc.serial.trim() != '' ? result.docSerial++ : null;
        doc.number != undefined && doc.number.trim() != '' ? result.docNumber++ : null;
        doc.issueDate != undefined && doc.issueDate.trim() != '' ? result.docIssueDate++ : null;
      }
    }
  }

})
print('Фамилия;Имя;Отчество;Дата Рождения;Пол;ДУЛ тип;ДУЛ серия;ДУЛ номер;ДУЛ Дата выдчи;Адрес регистрации;Email;Телефон')
print(`${result.surname};${result.firstName};${result.middleName};${result.dateOfBirth};${result.gender};${result.docType};${result.docSerial};${result.docNumber};${result.docIssueDate};${result.registrationAddressId};${result.emails};${result.phones};`)