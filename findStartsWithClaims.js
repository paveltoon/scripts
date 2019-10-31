function getActualDate(date){
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();
 
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
 
	return(dt + '.' + month + '.' + year);
};

var providers = [
/^Помазуева Мария Владимировна.*/i,
/^Односталко Маргарита Геннадьевна.*/i,
/^Жукова Юлия Владимировна.*/i,
/^Федотова Татьяна Юрьевна.*/i,
/^Солдатенкова Мария Геннадиевна.*/i,
/^Колесников Александр Васильевич.*/i,
/^Рязанцева Наталья Александровна.*/i,
/^Подлесная Светлана Викторовна.*/i,
/^Крохина Фаина Максимовна.*/i,
/^Осипова Марина Евгеньевна.*/i,
/^Чернышова Людмила Николаевна.*/i,
/^Данилова Евгения Сергеевна.*/i,
/^Кирьянова Оксана Дмитриевна.*/i,
/^Лобанова Ксения Сергеевна.*/i,
/^Булкина Ольга Сергеевна.*/i,
/^Губарева Екатерина Михайловна.*/i,
/^Астахова Елена Николаевна.*/i,
/^Ершова Наталья Евгеньевна.*/i,
/^Ильенко Ирина Борисовна.*/i,
/^Баранова Светлана Михайловна.*/i,
/^Никитина Екатерина Дмитриевна.*/i,
/^Никитина Наталья Александровна.*/i,
/^Жданова Нелли Николаевна.*/i,
/^Тюрина Юлия Владимировна.*/i,
/^Харитонова Людмила Николаевна.*/i,
/^Филиппова Ирина Анатольевна.*/i,
/^Поспехова Ирина Юрьевна.*/i,
/^Ким Ирина Георгиевна.*/i,
/^Байкова Юлия Викторовна.*/i,
/^Марцун Елена Анатольевна.*/i,
/^Линькова Наталья Владимировна.*/i,
/^Привалова Юлия Викторовна.*/i,
/^Глазкова Мария Владимировна.*/i,
/^Белова Ирина Максимовна.*/i,
/^Павлова Виктория Алексеевна.*/i,
/^Бабурина Наталья Владимировна.*/i,
/^Горелова Наталья Юрьевна.*/i,
/^Зрителева Кристина Валерьевна.*/i,
/^Никонова Елена Васильевна.*/i,
/^Богомолова Ирина Михайловна.*/i
]

for (var i = 0; i < providers.length; i++) {

    var cursor = db.claims.find({
        "senderCode": /^50.*/i,
        "providerName": providers[i],
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

    cursor.forEach(function(claim){
        var ccn = claim.customClaimNumber;
        var created = getActualDate(claim.claimCreate);
        var serviceName = claim.service.name;
        var servId = claim.service.srguServiceId;
        var mfc = claim.creatorDeptId;
        var statusNow = claim.currStatus.statusCode;
        var operFIO = claim.providerName;
        var daysToDead = claim.daysToDeadline
        print(ccn + ';' + created + ';' + serviceName + ';' + servId + ';' + mfc + ';' + statusNow + ';' + operFIO + ';' + daysToDead);
    })

}