db.claims.find({
    "customClaimNumber": {
        $in: [
            "50-0-1-308/3001/2019-4718"
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
    if (searchStatus[0] != undefined) {
        var firstDate = searchStatus[0].statusDate;

        //Set currStatus & docSendDate
        var update = {};
        var currStat = searchStatus[0];
        delete currStat._class;
        update.currStatus = currStat;

        var findDocSend = db.claims_status.find({
            "claimId": origId.valueOf(),
            "statusCode": {
                $in: ["3", "4"]
            }
        }).sort({
            "statusDate": 1
        }).toArray();
        if (findDocSend[0] != undefined) {
            update.docSendDate = findDocSend[0].statusDate;
        }

        //Update & Print
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: update
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
    }
});