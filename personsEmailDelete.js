var mail = "sokolov.dmitrii@bk.ru";

db.persons.find({
    "contacts.value": mail
}).forEach(function (pers) {
    var persId = pers._id;
    var i = 0;
    var contacts = pers.contacts;
    for (var i in contacts) {
        var val = contacts[i];
        if (val.value == mail) {
            val.value = "";
            i++;
        }
    }
    if (i > 0) {
        var upd = db.persons.update({
            "_id": persId
        },{
            $set: {
                "contacts": contacts
            }
        },{
            multi: true
        });
        print(persId.valueOf() + ' ' + upd.nModified + ' / ' + upd.nMatched);
    }
})