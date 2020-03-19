var idArr = [
    "5e2aec9622e5c60001d1735c",
    "5e285e5f22e5c60001aa405c",
    "5e286f3022e5c60001abf074",
    "5e2c05e122e5c60001d925a6",
    "1cee7284-3856-4e2b-a031-5d8bff918956",
    "e597693e-9719-41a5-a8a7-8748d9f29650",    
];
function getId(id) {
    if (id.length == 24) {
        return ObjectId(id);
    } else {
        return id;
    }
}
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
for(var i in idArr){
    db.claims.find({"_id": getId(idArr[i])}).forEach(function(claim){
        var deadlineDate = getActualDate(claim.deadlineDate);
        print(deadlineDate)
    })
}
