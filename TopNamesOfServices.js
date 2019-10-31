var servicesmap = [
    "5000000000193685782",
    "5000000000192716264",
    "5000000010000003763",
    "5000000000189808193",
    "5000000010000027991",
    "5000000010000000897",
    "5000000000167439476",
    "5000000000167006307",
    "5000000010000068112",
    "5000000000167433775"
];

for (var i = 0; i < servicesmap.length; i++) {
    var cursor = db.claims.findOne({ "service.srguServicePassportId": servicesmap[i] });
    if(cursor == null || cursor == undefined) {
      print("Не найдено совпадений");
    } else {
    print(cursor.service.srguDepartmentName + ';' + cursor.service.srguServicePassportName);
    }
}