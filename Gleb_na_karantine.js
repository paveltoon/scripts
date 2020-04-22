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
    return (year + '-' + month + '-' + dt + " " + hour + ':' + minute + ':' + second);
}
/* for(var i in idArr){
    db.claims.find({"_id": getId(idArr[i])}).forEach(function(claim){
        var deadlineDate = getActualDate(claim.deadlineDate);
        print(deadlineDate)
    })
} */

db.claims_status_mku.find({ "createDate": { $gte: ISODate("2020-04-02T19:00:00.000+0000") } }).forEach(function(mku){
    var id = mku.claimId.valueOf();
    var deadDate = getActualDate(mku.statusDate);
    print(id + ';' + deadDate)
})