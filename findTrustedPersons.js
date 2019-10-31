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

var providers = [
    "Помазуева Мария Владимировна",
    "Односталко Маргарита Геннадьевна",
    "Жукова Юлия Владимировна",
    "Федотова Татьяна Юрьевна",
    "Солдатенкова Мария Геннадиевна",
    "Колесников Александр Васильевич",
    "Рязанцева Наталья Александровна",
    "Подлесная Светлана Викторовна",
    "Крохина Фаина Максимовна",
    "Осипова Марина Евгеньевна",
    "Чернышова Людмила Николаевна",
    "Данилова Евгения Сергеевна",
    "Кирьянова Оксана Дмитриевна",
    "Лобанова Ксения Сергеевна",
    "Булкина Ольга Сергеевна",
    "Губарева Екатерина Михайловна",
    "Астахова Елена Николаевна",
    "Ершова Наталья Евгеньевна",
    "Ильенко Ирина Борисовна",
    "Баранова Светлана Михайловна",
    "Никитина Екатерина Дмитриевна",
    "Никитина Наталья Александровна",
    "Жданова Нелли Николаевна",
    "Тюрина Юлия Владимировна",
    "Харитонова Людмила Николаевна",
    "Филиппова Ирина Анатольевна",
    "Поспехова Ирина Юрьевна",
    "Ким Ирина Георгиевна",
    "Байкова Юлия Викторовна",
    "Марцун Елена Анатольевна",
    "Линькова Наталья Владимировна",
    "Привалова Юлия Викторовна",
    "Глазкова Мария Владимировна",
    "Белова Ирина Максимовна",
    "Павлова Виктория Алексеевна",
    "Бабурина Наталья Владимировна",
    "Горелова Наталья Юрьевна",
    "Зрителева Кристина Валерьевна",
    "Никонова Елена Васильевна",
    "Богомолова Ирина Михайловна"
];

for (var i = 0; i < providers.length; i++) {
    var provArr = providers[i].split(' ');
    var cursor = db.claims.find({
        "trustedPersons.0.trustedPerson.trustedPersonInfo.surname": provArr[0],
        "trustedPersons.0.trustedPerson.trustedPersonInfo.firstName": provArr[1],
        "trustedPersons.0.trustedPerson.trustedPersonInfo.middleName": provArr[2],
        "senderCode": "IPGU01001",
        $or: [{
            "service.srguServicePassportId": "5000000010000004507"
        }, {
            "service.srguServicePassportId": "10000002755"
        }, {
            "service.srguServicePassportId": "5000000000182799258"
        }, {
            "service.srguServicePassportId": "5000000000167433775"
        }, {
            "service.srguServicePassportId": "5000000000183661294"
        }, {
            "service.srguServicePassportId": "10002451885"
        }, {
            "service.srguServicePassportId": "321152319"
        }, {
            "service.srguServicePassportId": "10002451885"
        }]
    });

    cursor.forEach(function (claim) {
        var ccn = claim.customClaimNumber;
        var created = getActualDate(claim.claimCreate);
        var serviceName = claim.service.name;
        var servId = claim.service.srguServiceId;
        var mfc = claim.creatorDeptId;
        var statusNow = claim.currStatus.statusCode;
        var operFIO = providers[i];
        var daysToDead = claim.daysToDeadline
        print(ccn + ';' + created + ';' + serviceName + ';' + servId + ';' + mfc + ';' + statusNow + ';' + operFIO + ';' + daysToDead);
    });
}