var idArr = [
"5e2ee10d22e5c60001ec20d0",
"5e30167722e5c60001fbd92e",
"5e30284b22e5c60001fdb4f4",
"5e302acc22e5c60001fdf6bb",
"5e30684022e5c6000103824b",
"5e32e2cf22e5c6000124c4fa",
"5e351a5f22e5c60001c0805d",
"5e35636622e5c60001c54d6a",
"5e3569e022e5c60001c5dad9",
"5e35991b22e5c60001c90f48",
"5e36b0d722e5c60001cf748c",
"5e372d8e22e5c60001d19628",
"5e37d15d22e5c60001d555b7",
"5e37d76222e5c60001d5fc9b"
];
function getId(id) {
    if (id.length = 24) {
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
