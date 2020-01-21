var cursor = db.claims.find({
    "currStatus.statusCode": "1",
    "currStatus.senderCode": "SAWS05001",
    "currStatus.senderName": "RLDD to SMEV 3 integration service",
    "currStatus.comment": "List of AttachmentData is empty but AttachmentData is required"
});

cursor.forEach(function (claim) {
    var origId = claim._id.valueOf();
    var ccn = claim.customClaimNumber;
    
    var statuses = db.claims_status.find({
        "claimId": origId
    }).sort({
        "statusDate": -1
    }).toArray();

    var statusId = statuses[0]._id;

    var StatusDateMS = statuses[0].statusDate.getTime();
    var statusDateNew = new Date(StatusDateMS);

    var createDateMS = statuses[0].createDate.getTime();
    var createDateNew = new Date(createDateMS);


    var statusCodeNew = statuses[0].statusCode;
    var senderCodeNew = statuses[0].senderCode;

    var currStatusNew = {
        "_id": statusId,
        "claimId": origId,
        "statusDate": statusDateNew,
        "statusCode": statusCodeNew,
        "senderCode": senderCodeNew,
        "createDate": createDateNew,
        "lastModified": createDateNew,
        "createBy": "rldd2",
        "lastModifiedBy": "rldd2",
        "createState": "COMPLETED"
    }
    var upd = db.claims.update(
        { "customClaimNumber": ccn },
        { $set: { "currStatus" : currStatusNew } },
        { multi: true }
    );
    print("Claim: " + ccn + ", with ID: " + origId + " has been corrected. Progress: " + upd.nModified + ' / ' + upd.nMatched);
});