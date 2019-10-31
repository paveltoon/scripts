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

var cursor = db.claims.find({
    "service.srguDepartmentId": "5000000010000000255",
    "claimCreate": {
        $gte: ISODate("2018-08-15T00:00:00.000+0000"),
        $lte: ISODate("2018-08-21T00:00:00.000+0000")
    },
    "oktmo": {
        $ne: "99999999"
    },
    "consultation": false
});

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var ccn = claim.customClaimNumber;

    if(claim.fields && claim.fields.sequenceValue){
        var fields = claim.fields.sequenceValue;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].title == "Отдел социальной защиты населения" || fields[i].title == "Орган социальной защиты населения") {
                print(ccn + ';' + getActualDate(claim.claimCreate) + ';' + claim.creatorDeptId + ';' + claim.deptId + ';' + claim.oktmo + ';' + claim.service.name + ";Status: " + claim.currStatus.statusCode + ";" + fields[i].value);
                return;
            } else if (i == fields.length - 1 && (fields[i].title != "Отдел социальной защиты населения" || fields[i].title == "Орган социальной защиты населения")) {
                print(ccn + ';' + getActualDate(claim.claimCreate) + ';' + claim.creatorDeptId + ';' + claim.deptId + ';' + claim.oktmo + ';' + claim.service.name + ";Status: " + claim.currStatus.statusCode);
                return;
            }
        }
    } else {
        print(ccn);
    }
});