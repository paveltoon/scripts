var scale = 1;
var total = db.claims.find({}).count();
var current = 0;

var bulk = db.claims.initializeUnorderedBulkOp();

db.claims.find({}).forEach(function (claim) {
  
             
    if (current % 1000 == 0) {
        bulk.execute();
        bulk = db.claims.initializeUnorderedBulkOp();
    }
    var progress = Math.round((current/total)*100);
    
    var ccn = claim.customClaimNumber;
    var statusesObj = [];

    if (claim._id.length == 24) {
        var origId = ObjectId(claim._id.valueOf());
    } else {
        var origId = claim._id.valueOf();
    }

    if (claim.statuses) {
        current++;
        print("Claim " + ccn + ' already have statuses in body. (' + progress + '%)')
    } else {
        
        var findStatuses = db.claims_status.find({
            "claimId": claim._id.valueOf()
        }).limit(50).sort({
            "statusDate": 1
        }).toArray();

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
            current++;
            print("Claim " + ccn + ' corrected. (' + progress + '%)')
   

        } else {
            current++;
            print("Claim " + ccn + ' have no statuses. (' + progress + '%)')
        }


    }


});
bulk.execute();

print("Done " + current + " : " + total);