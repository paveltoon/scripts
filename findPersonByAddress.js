function getId(id) {
    if (id.length == 24) {
        return ObjectId(id);
    } else {
        return id;
    }
}

db.addresses.find({
    "area": "Орехово-Зуево",
    "street": "Гагарина",
    "houseNumber": "31"
}).forEach(function (adr) {

    var adrRoom = adr.room;
    var adrType = adr.type;
    if (adr.personId != undefined) {
        var id = getId(adr.personId);
        var person = db.persons.findOne({
            "_id": id
        });

        if (person != null && person != undefined) {
            var persId = person._id.valueOf();
            var phones = [];
            var emails = [];
            if (person.contacts != undefined) {
                for (var j in person.contacts) {
                    if (person.contacts[j].type == "EML") {
                        emails.push(person.contacts[j].value)
                    } else {
                        phones.push(person.contacts[j].value)
                    }
                }
                // print(phones + ';' + emails)
            }

            var surname = person.surname;
            var firstName = person.firstName;
            var middleName;

            if (person.middleName != undefined) {
                middleName = person.middleName;
            } else {
                middleName = "-"
            }
            print(persId + ';' + adrType + ';' + adrRoom + ';' + surname + ';' + firstName + ';' + middleName + ';' + phones + ';' + emails)

        }
    }
})