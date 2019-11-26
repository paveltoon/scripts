var cursor = db.claims.find({}).limit(10);

cursor.forEach(function(claim){
    var origId = claim._id.valueOf();
    var findStatuses = db.claims_status.find({ "claimId": origId }).sort({"statusDate": 1}).toArray();
    
    var statusesObj = [];
    for(var i in findStatuses) {
      	var stat = findStatuses[i];
        var statusObj = {
            id : stat._id,
            statusDate : stat.statusDate,
            statusCode : stat.statusCode,
            senderCode : stat.senderCode,
            senderName : stat.senderName,
            comment : stat.comment,
            operatorId : stat.operatorId,
            operatorFio : stat.operatorFio,
            deptId : stat.deptId,
            additionalInfo : stat.additionalInfo,
            suspenseDays : stat.suspenseDays,
            suspenseReason : stat.suspenseReason,
            resolutionCauseInfos : stat.resolutionCauseInfos,
            createState : stat.createState
        }
        for(var key in statusObj){
            if (statusObj[key] == undefined || statusObj[key].trim() == ""){
                delete statusObj[key];
            }
        }
        statusesObj.push(statusObj);
    }
    claim.statuses = statusesObj;
    db.claims.save(claim);
    print(claim.customClaimNumber)
});