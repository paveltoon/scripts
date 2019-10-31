//Functions
function getDayOfYear(date) {
    var month = date.getMonth();
    var year = date.getFullYear();
    var days = date.getDate();
    for (var i = 0; i < month; i++) {
        days += new Date(year, i + 1, 0).getDate();
    }
    return days;
};

// Catalog init
var file = cat('C:/MAP/claims.txt');
var ccn = file.split('\n');

// Loop begins
for (var i = 0; i < ccn.length; i++) {

    var cursor = db.claims.findOne({
        "customClaimNumber": ccn[i]
    });

    if (cursor != (undefined && null)) {
        var deadlineStages = cursor.deadlineStages;
        var stageArr = [];

        // Check extra elements with DEADLINE_TRANSFER
        for (var j = 0; j < deadlineStages.length; j++) {
            if (deadlineStages[j].stageType == "DEADLINE_TRANSFER") {
                stageArr.push(j);
            }
        }

        // Delete extra elements from array
        stageArr.shift();
        for (var num in stageArr) {
            deadlineStages.splice(stageArr[num]);
        }

        // Vars set
        var deadlineDate = cursor.deadlineDate;
        var deadlineDiff = stageArr.length;
        var newDeadlineDate = (deadlineDate.setDate(deadlineDate.getDate() - deadlineDiff))
        cursor.daysToDeadline -= deadlineDiff;

        db.claims.save(cursor)
        print('Claim: ' + ccn[i] + ', daysToDeadlne: ' + cursor.daysToDeadline + ', Deleted stages: ' + stageArr.length);
    } else {
        print(ccn[i] + ';wrong claim number');
    }
}