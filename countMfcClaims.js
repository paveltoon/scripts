var mfcNames = {};
var totalCount = 0;
var count65 = 0;
var nowMS = new Date();

db.claims.find({
    "activationDate": {
        $gte: ISODate("2020-03-15T21:00:00.000+0000"),
        $lte: ISODate("2020-03-16T21:00:00.000+0000")
    },
    "senderCode": /^5000.*/i
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    // Get Dept
    var dept;
    if (claim.creatorDeptId != undefined) {
        dept = claim.creatorDeptId;
    } else if (claim.deptId != undefined) {
        dept = claim.deptId;
    } else return;

    // Set count to object
    if (dept == "mfc" || dept == "mfc-work" || dept == "dept-gibdd-nalog") {
        return;
    } else if (mfcNames[dept] == undefined) {
        mfcNames[dept] = 1;
        totalCount++;
    } else {
        mfcNames[dept] += 1;
        totalCount++;
    }
    // Older persons 65+
    if (claim.personsInfo && claim.personsInfo[0] && claim.personsInfo[0].dateOfBirth) {
        var birthDateMS = claim.personsInfo[0].dateOfBirth.split("T", 1).join("");
        var birthDate = new Date(birthDateMS)
        var yearMS = 31536000000;
        var age = Math.floor((nowMS - birthDate) / yearMS);
        if (age > 65) {
            count65++;
        }
    }

})
for (var key in mfcNames) {
    print(key + ';' + mfcNames[key])
}
var percentOfPersons = (100 * count65) / totalCount
print('Всего;' + totalCount + '\n' +
    'Старше 65 лет;' + count65 + '\n' +
    'Процент;' + percentOfPersons.toFixed(2) + '%'
)