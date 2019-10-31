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

var statuses =  db.claims_status.find({ "statusCode": "33" });

statuses.forEach(function(stat){
    var origId = stat.claimId;
    var cursor = db.claims.findOne({ "currStatus.claimId": origId });
    if (cursor != (undefined && null)){
        var ccn = cursor.customClaimNumber;
        var createDate = cursor.createDate;
        var serviceId = cursor.service.srguServiceId;
        var serviceName = cursor.service.srguServiceName;
        var passportId = cursor.service.srguServicePassportId;
        var passportName = cursor.service.srguServicePassportName; 
        if(createDate > ISODate("2019-01-01T00:00:00+0000")){
            print(ccn + ';' + getActualDate(createDate) + ';' + serviceId + ';' + serviceName + ';' + passportId + ';' + passportName);
        }
    }
})
