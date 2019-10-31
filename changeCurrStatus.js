var iter = 0;
var cursor = db.claims.find({
    "service.srguServiceId": "5000000000182799268",
    "currStatus.statusCode": "6",
    "currStatus.senderCode": "IPGU01001"
});
cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;

    var upd = db.claims.update({
        "customClaimNumber": ccn,
        "currStatus.statusCode": "6",
        "currStatus.senderCode": "IPGU01001"
    }, {
        $set: {
            "currStatus.statusCode": "2"
        }
    },
    {
        multi: true
    });

    print(upd.nModified + ' / ' + upd.nMatched);
    iter++;
});

print("Claim count: " + iter);