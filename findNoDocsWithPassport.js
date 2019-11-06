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
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return (dt + '.' + month + '.' + year + " / " + hour + ':' + minute + ':' + second);
};
print("Номер заявки;Наимнование услуги;Наименование процедуры;Дата создания заявки;Текущий статус;Департамент;МФЦ")
var cursor = db.claims.find({
    "service.srguServicePassportId": "5000000010000000897",
    "senderCode": "IPGU01001",
    "claimCreate": {
        $gte: ISODate("2019-08-31T21:00:00.000+0000")
    }
});

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var ccn = claim.customClaimNumber;
    var passportName = claim.service.srguServicePassportName;
    var serviceName = claim.service.name;
    var claimCreate = getActualDate(claim.claimCreate);
    var stat = claim.currStatus.statusCode;
    var departament = claim.service.srguDepartmentName;
    var dept = claim.creatorDeptId;
    var docFind = db.docs.find({
        "ownerId": id
    }).toArray();

    if (docFind.length == 0 || (docFind.length <= 2 && (docFind[0].title == "Результат предоставления услуги" || (docFind[0].title == "Заявление" && docFind[0].originPageCount == "0")))  ) {
        print(ccn + ';' + passportName + ';' + serviceName + ';' + claimCreate + ';' + stat + ';' + departament + ';' + dept);
        return;
    } else {
        return;
    }
});