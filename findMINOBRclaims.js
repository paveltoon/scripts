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

var cursor = db.claims.find({ "claimCreate": { $gte: ISODate("2019-06-01T00:00:00.000+0000") }, "service.srguServiceId": "5000000000201473070", "oktmo": { $ne: "99999999" }, "consultation": false });

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var ccn = claim.customClaimNumber;

    if(claim.fields && claim.fields.sequenceValue){
        var fields = claim.fields.sequenceValue;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].stringId == "munObr") {
                print(ccn + ';' + fields[i].value);
                return;
            } else if (i == fields.length - 1 && (fields[i].stringId != "munObr")) {
                print(ccn);
                return;
            }
        }
    } else {
        print(ccn);
    }
});