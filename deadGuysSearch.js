var start = new Date().getTime();
function getActualDate(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return (dt + '.' + month + '.' + year);
};

var cursor = db.claims.find({
    "oktmo": {
        $ne: "99999999"
    },
    "consultation": false,
    "claimCreate": {
        $gte: ISODate("2019-10-02T21:00:00.000+0000"),
        $lte: ISODate("2019-10-30T21:00:00.000+0000")
    },
    "service.srguServiceId": {
        $in: ["5000000000193341251", "5000000000193343465", "5000000000193342741", "5000000000193341876", "5000000000193342666", "5000000000193344052"]
    }
});
print("Номер заявления;Дата подачи;ФИО Заявителя;ФИО Доверенного лица;Наименование процедуры;База данных МФЦ;ФИО Умершего;Место жительства (пребывания) умершего (КЛАДР)")
cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var claimCreated = getActualDate(claim.claimCreate);
    var personFIO = claim.person.fio;
    if (claim.trustedPersons != undefined && claim.trustedPersons.length > 0) {
        var trustedFIO = claim.trustedPersons[0].trustedPerson.trustedPersonInfo.surname + ' ' + claim.trustedPersons[0].trustedPerson.trustedPersonInfo.firstName + ' ' + claim.trustedPersons[0].trustedPerson.trustedPersonInfo.middleName;
    } else {
        var trustedFIO = 'Доверенное лицо отсутствует'
    }
    var servName = claim.service.name;
    var creatorDept = claim.creatorDeptId;
    var fields = claim.fields;
    var deadObj = {};
    if (fields != (undefined && null)) {
        for (var i in fields.sequenceValue) {
            if (fields.sequenceValue[i].title == "Сведения об умершем" || fields.sequenceValue[i].title == "Сведения о лице, на которое производится перерегистрация") {
                var deadInfo = fields.sequenceValue[i].sequenceValue;
                for (var j in deadInfo) {
                    if (deadInfo[j].value != undefined) {
                        switch (deadInfo[j].title) {
                            case 'Фамилия':
                                deadObj.deadSurname = deadInfo[j].value;
                                break;
                            case 'Фамилия умершего':
                                deadObj.deadSurname = deadInfo[j].value;
                                break;
                            case 'Фамилия лица, на которое производится перерегистрация':
                                deadObj.deadSurname = deadInfo[j].value;
                                break;
                            case 'Имя':
                                deadObj.deadName = deadInfo[j].value;
                                break;
                            case 'Имя умершего':
                                deadObj.deadName = deadInfo[j].value;
                                break;
                            case 'Имя лица, на которое производится перерегистрация':
                                deadObj.deadName = deadInfo[j].value;
                                break;
                            case 'Отчество':
                                deadObj.deadMiddleName = deadInfo[j].value;
                                break;
                            case 'Отчество умершего':
                                deadObj.deadMiddleName = deadInfo[j].value;
                                break;
                            case 'Отчество лица, на которое производится перерегистрация':
                                deadObj.deadMiddleName = deadInfo[j].value;
                                break;
                            case 'Последнее место регистрации (место жительства) умершего':
                                deadObj.deadAdress = deadInfo[j].value.url;
                                break;
                        }
                    }
                }
            }
        }
    }

    if (deadObj.deadAdress != (undefined && null)) {
        var deadAdr = deadObj.deadAdress.split('http://10.10.80.54:8080/api//addresses/').join('');
        var adressFind = db.addresses.findOne({
            "_id": ObjectId(deadAdr)
        });
        if (adressFind != (undefined && null) && adressFind.kladrCode != (undefined && null)) {
            if (adressFind.kladrCode.length < 18) {
                var kladr = adressFind.kladrCode;
            } else {
                var kladr = 'Данные отсутствуют';
            }
        } else {
            var kladr = 'Данные отсутствуют';
        }
    } else {
        var kladr = 'Данные отсутствуют';
    }

    print(ccn + ';' + claimCreated + ';' + personFIO + ';' + trustedFIO + ';' + servName + ';' + creatorDept + ';' + deadObj.deadSurname + ' ' + deadObj.deadName + ' ' + deadObj.deadMiddleName + ';' + kladr)
});
var end = new Date().getTime();
var timer = end - start;
print("Script works: " + timer + ' ms.')