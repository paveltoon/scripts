var emailArr = [
    "samatveev@bk.ru",
    "sohosoho@bk.ru",
    "djsstar@mail.ru",
    "demidov191086@yandex.ru",
    "002pan@bk.ru",
    "PashaPetroww@yandex.ru",
    "lulka.s@mail.ru",
    "18smc@bk.ru",
    "natashareg1982@mail.ru",
    "yelena.slesareva@inbox.ru"
];

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
print("Номер заявления;МФЦ;Дата создания;Наименование процедуры;ФИО Оператора;ФИО Заявителя;Email");

for (var i in emailArr){

var cursor = db.claims.find({
    "claimCreate": { $gte: ISODate("2019-09-30T21:00:00.000+0000") },
    $or: [{
        "personsInfo.contacts": {
            $elemMatch: {
                "type": "EML",
                "value":  emailArr[i]
            }
        }
    }, {
        "trustedPersons.trustedPerson.trustedPersonInfo.contacts": {
            $elemMatch: {
                "type": "EML",
                "value": emailArr[i]
            }
        }
    }]
});

cursor.forEach(function (claim){
    var ccn = claim.customClaimNumber;
    var dept = claim.creatorDeptId;
    var created = getActualDate(claim.claimCreate);
    var servName = claim.service.name;
    var operatorFio = claim.providerName;
    var personFio = claim.person.fio;
    var email = emailArr[i];

    print(ccn + ';' + dept + ';' + created + ';' + servName + ';' + operatorFio + ';' + personFio + ';' + email);
});

}