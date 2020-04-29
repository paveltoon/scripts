var file = cat('C:/MAP/snilsTest.txt');
var snils = file.split('\n');

function fromatSnils(snils) {
    if (snils.length < 11) {
        while (snils.length < 11) {
            snils = '0' + snils;
        }
    }
    return snils;
}

function badFormatSnils(snils) {
    var el = snils.split('');
    return el[0] + el[1] + el[2] + '-' + el[3] + el[4] + el[5] + '-' + el[6] + el[7] + el[8] + ' ' + el[9] + el[10];
}

var result = {
    total: 0,
    email: 0,
    phone: 0,
    emailAndPhone: 0
}

for (var i in snils) {
    var formatedSnils = fromatSnils(snils[i]);
    var snilsSearch = db.persons.findOne({
        "snils": formatedSnils
    });

    var isFinded = false;
    var email = [];
    var phone = [];
    var snilsFounded;

    if (snilsSearch != null) {
        isFinded = true;
        snilsFounded = formatedSnils;
    } else {
        var badSnils = badFormatSnils(formatedSnils);
        snilsSearch = db.persons.findOne({
            "snils": badSnils
        })

        if (snilsSearch != undefined) {
            isFinded = true;
            snilsFounded = badSnils;
        } else {
            print(";;Snils doesn't found.")
        }
    }

    if (!isFinded) {
        continue;
    }

    result.total++;

    if (snilsSearch.contacts != undefined && snilsSearch.contacts.length > 0) {
        for (var j in snilsSearch.contacts) {
            var contact = snilsSearch.contacts[j];
            if (contact.type == "EML") {
                email.push(contact.value)
            } else {
                phone.push(contact.value)
            }
        }
    }

    if (email.length) {
        result.email++;
    }
    if (phone.length) {
        result.phone++;
    }
    
    if (phone.length && email.length) {
        result.emailAndPhone++;
    }
    print(phone + ';' + email + ';' + snilsFounded)
}

print(  
    "Всего: " + result.total + '\n' + 
    "Телефонов: " + result.phone + '\n' + 
    "Емэилов: " + result.email + '\n' + 
    "Телефонов и емэйлов: " + result.emailAndPhone + '\n'
);