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
        $gte: ISODate("2019-08-01T00:14:25.292+0000")
    },
    "service.srguServicePassportId": {
        $ne: "5000000010000003763"
    },
    "service.srguServicePassportId": {
        $ne: "5000000010000000510"
    }
});

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var ccn = claim.customClaimNumber;

    var docFind = db.docs.find({
        "ownerId": id
    }).toArray();

    if (docFind.length == 0) {
        var fields = claim.fields.sequenceValue;
        for(var i=0; i<fields.length; i++){
            if(fields[i].title == "Отдел социальной защиты населения" || fields[i].title == "Орган социальной защиты населения"){
                print(ccn + ';' + getActualDate(claim.claimCreate) + ';' + claim.creatorDeptId + ';' + claim.deptId + ';' + claim.oktmo + ';' + claim.service.name + ";Status: " + claim.currStatus.statusCode + ";" + fields[i].value);
                return;
            } else if(i == fields.length-1 && (fields[i].title != "Отдел социальной защиты населения" || fields[i].title == "Орган социальной защиты населения")){
                print(ccn + ';' + getActualDate(claim.claimCreate) + ';' + claim.creatorDeptId + ';' + claim.deptId + ';' + claim.oktmo + ';' + claim.service.name + ";Status: " + claim.currStatus.statusCode);
                return;
            }
        }
       
    } else {
        return;
    }

});