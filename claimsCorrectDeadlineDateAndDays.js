var cursor = db.claims.find({
    "service.srguServiceId": "5000000000213945358",
    "claimCreate": {
        $gte: ISODate("2019-11-30T21:00:00.000+0000"),
        $lte: ISODate("2019-12-31T21:00:00.000+0000")
    }
});

cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var correctDate = new Date(2020, 0, 23);
    var now = new Date();
    var daysToDeadline = Math.ceil((correctDate - now) / (24 * 60 * 60 * 1000));

    var upd = db.claims.update({
        "customClaimNumber": ccn
    }, {
        $set: {
            "deadlineDate": correctDate,
            "daysToDeadline": NumberInt(daysToDeadline)
        }
    });
    print("Claim " + ccn + " Updated: " + upd.nModified + ' / ' + upd.nMatched);
})