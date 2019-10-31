var claimCursor = db.getCollection("claims").find({
    "customClaimNumber": {
        $in: ["M503-8362758548-22607814", "B001-4967173383-38"]
    }
}).addOption(DBQuery.Option.noTimeout);

function daysBetweenDates(dateFirst, dateSecond) {
    var first = dateFirst.getTime();
    var second = dateSecond.getTime();

    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

claimCursor.forEach(function (claim) {
    var origClaimId = claim._id;
    var suspenseReason = claim.suspenseReason;

    if (suspenseReason != undefined || suspenseReason != null) {

        var statuses70 = db.claims_status.find({
            "claimId": origClaimId,
            $or: [{
                "statusCode": "70"
            }, {
                "statusCode": "71"
            }]
        }).sort({
            "statusDate": 1
        }).toArray();

        var suspenseDaysResult = 0;
        for (var j = 0; j < statuses70.length; j++) {
            if (statuses70[j].statusCode == "70" && statuses70[j + 1] != undefined && statuses70[j + 1].statusCode == "71") {
                suspenseDaysResult += daysBetweenDates(statuses70[j].statusDate, statuses70[j + 1].statusDate);
            }
        }
        print(suspenseDaysResult);

    }

});