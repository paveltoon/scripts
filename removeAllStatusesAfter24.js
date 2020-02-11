db.claims.find({
    "customClaimNumber": {
        $in: [
            "50-50/028-50/028/008/2019-2986"
        ]
    }
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origId = claim._id;
    var searchStatus = db.claims_status.find({
        "claimId": origId.valueOf(),
        "statusCode": "24"
    }).sort({
        "statusDate": 1
    }).toArray();
    var firstDate = searchStatus[0].statusDate;

    //Set currStatus
    var currStat = searchStatus[0];
    delete currStat._class;

    //Update & Print
    var upd = db.claims.update({
        "customClaimNumber": ccn
    }, {
        $set: {
            "currStatus": currStat
        }
    }, {
        multi: true
    });

    // Remove other statuses
    var removeStatuses = db.claims_status.remove({
        "claimId": origId.valueOf(),
        "statusDate": {
            $gt: firstDate
        }
    });
    print(ccn + '; Updated: ' + upd.nModified + ' / ' + upd.nMatched + "; Deleted - " + removeStatuses.nRemoved + " statuses");
});