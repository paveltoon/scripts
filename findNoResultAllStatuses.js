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

print("Номер заявки;Дата создания;Код процедуры;Наименование процедуры;Код услуги;Наименование услуги;Настоящий статус;Список статусов");

var cursor = db.claims.find({
    "service.srguDepartmentId": "5000000010000000255",
    "claimCreate": {
        $gte: ISODate("2019-09-30T21:00:00.000+0000")
    },
    "resultStatus": {
        $exists: false
    }
});

cursor.forEach(function (claim) {
    var origId = claim._id.valueOf()
    var statuses = db.claims_status.findOne({
        "claimId": origId,
        $or: [{
            "statusCode": "4"
        }, {
            "statusCode": "3"
        }]
    });
    if (!claim.resultStatus && statuses != (undefined && null)) {
        var statusArr = []
        var ccn = claim.customClaimNumber;
        var servId = claim.service.srguServiceId;
        var servName = claim.service.name;
        var passId = claim.service.srguServicePassportId;
        var passName = claim.service.srguServicePassportName
        var statusNow = claim.currStatus.statusCode;
        var claimCreate = getActualDate(claim.claimCreate);
        var statusModel = db.claims_status.find({
            "claimId": origId
        }).sort({
            "statusDate": 1
        }).toArray();
        for (var i in statusModel) {
            var status = statusModel[i].statusCode
            statusArr.push(status);
        }

        var allStat = statusArr.splice('').join('-');
        print(ccn + ';' + claimCreate + ';' + servId + ';' + servName + ';' + passId + ';' + passName + ';' + statusNow + ';' + allStat);
    }
})