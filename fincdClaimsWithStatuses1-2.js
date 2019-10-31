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

print("customClaimNumber;claimCreate;service.name;service.srguDepartmentName;resultStatus;statusCodeNow;statusCode1;statusDate1;statusCode2;statusDate2;")

var cursor = db.claims.find({
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0000"),
        $lte: ISODate("2019-04-01T00:00:00.000+0000")
    },
    "oktmo": {
        $ne: "99999999"
    },
    $or: [{
        "senderCode": /^50.*/i
    }, {
        "senderCode": "RRTR01001"
    }],
    "consultation": false
}).limit(10000);


cursor.forEach(function (claim) {
    var calimId = claim._id;
    var ccn = claim.customClaimNumber;
    var created = getActualDate(claim.claimCreate)
    var serviceName = claim.service.name;
    var departmentName = claim.service.srguDepartmentName;
    var resultStatus = claim.resultStatus;
    var statusNow = claim.currStatus.statusCode;


    var statuses = db.claims_status.find({
        "claimId": calimId,
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
    }).toArray();

    if (statuses.length != 0) {
        var statusesMas = [];
        for (var i = 0; i < statuses.length; i++) {
            var statusesCodes = statuses[i].statusCode;
            var statusesDates = getActualDate(statuses[i].statusDate);
            statusesMas.push(statusesCodes, statusesDates);
        }
        var resStatuses = statusesMas.join(';');
        print(ccn + ';' + created + ';' + serviceName + ';' + departmentName + ';' + resultStatus + ';' + statusNow + ';' + resStatuses)

    } else {
        return;
    }
});