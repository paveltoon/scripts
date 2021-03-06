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
    "service.srguDepartmentId": "5000000010000000255",
    "claimCreate": {
        $gte: ISODate("2019-09-01T00:00:00.000+0000"),
        $lte: ISODate("2019-10-01T00:00:00.000+0000")
    },
    "oktmo": {
        $ne: "99999999"
    },
    "consultation": false
});

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var docFind = db.docs.find({
        "ownerId": id
    }).toArray();

    if (docFind.length == 0 || (docFind.length == 1 && docFind[0].title == "Результат предоставления услуги")) {
        var ccn = claim.customClaimNumber;
        var passportName = claim.service.srguServicePassportName;
        var serviceName = claim.service.name;
        var claimCreate = getActualDate(claim.claimCreate);
        var stat = claim.currStatus.statusCode;
        var departament = claim.service.srguDepartmentName;
        var dept = claim.creatorDeptId;

        print(ccn + ';' + passportName + ';' + serviceName + ';' + claimCreate + ';' + stat + ';' + departament + ';' + dept);
        return;
    } else {
        return;
    }
});