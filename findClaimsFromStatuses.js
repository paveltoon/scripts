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

var statuses = db.claims_status.find({
    $or: [{
        "statusCode": "1"
    }, {
        "statusCode": "2"
    }],
    "statusDate": {
        $gte: ISODate("2019-07-01T21:00:00.000+0000"),
        $lte: ISODate("2019-07-02T21:00:00.000+0000")
    }
}).sort({
    "statusDate": 1
});

statuses.forEach(function (status) {
        var origClaimId = status.claimId;
        
        var cursor = db.claims.findOne({
            "currStatus.claimId": origClaimId
        });

        var ccn = cursor.customClaimNumber;
        var created = getActualDate(cursor.claimCreate)
        var serviceName = cursor.service.name;
        var departmentName = cursor.service.srguDepartmentName;
        var resultStatus = cursor.resultStatus;
        var statusNow = cursor.currStatus.statusCode;
    
    
        if (cursor.claimCreate >= ISODate("2019-01-01T00:00:00.000+0000") && cursor.claimCreate <= ISODate("2019-04-01T00:00:00.000+0000")){
            print(ccn + ';' + created + ';' + serviceName + ';' + departmentName + ';' + resultStatus + ';' + statusNow)
        }
    });