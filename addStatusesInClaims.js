var bulk = db.claims.initializeUnorderedBulkOp();
var iteration = 0;
var total = 0;
var cursor = db.claims.find({});
cursor.forEach(function (claim) {
    if (claim._id.length == 24) {
        var origId = ObjectId(claim._id.valueOf());
    } else {
        var origId = claim._id.valueOf();
    }
    var findStatuses = db.claims_status.find({
        "claimId": claim._id.valueOf()
    }).sort({
        "statusDate": 1
    }).toArray();
    var ccn = claim.customClaimNumber;
    var statusesObj = [];
    for (var i in findStatuses) {
        var stat = findStatuses[i];
        var statusObj = {
            id: stat._id,
            statusDate: stat.statusDate,
            statusCode: stat.statusCode,
            senderCode: stat.senderCode,
            senderName: stat.senderName,
            comment: stat.comment,
            operatorId: stat.operatorId,
            operatorFio: stat.operatorFio,
            deptId: stat.deptId,
            additionalInfo: stat.additionalInfo,
            suspenseDays: stat.suspenseDays,
            suspenseReason: stat.suspenseReason,
            resolutionCauseInfos: stat.resolutionCauseInfos,
            createState: stat.createState
        }
        for (var key in statusObj) {
            if (statusObj[key] == undefined) {
                delete statusObj[key];
            }
        }
        statusesObj.push(statusObj)
    }
    if (statusesObj.length != 0) {
        bulk.find({
            "_id": origId
        }).update({
            $set: {
                statuses: statusesObj
            }
        });
        iteration++;
        print(iteration + '. Claim: ' + ccn + ", id: " + claim._id.valueOf())
    } else {
        print(iteration + '. Claim: ' + ccn + ", id: " + claim._id.valueOf() + ' Have no statuses!')
    }
    
    if (iteration % 1000 == 0) {
        bulk.execute();
        bulk = db.claims.initializeUnorderedBulkOp();
    }

    total++;
});
bulk.execute();
print("Matched: " + total + " / Corrected: " + iteration);