var cursor = db.claims.find({
    "senderCode": "IPGU01001",
    "service.srguServiceId": "5000000000185952137",
    "claimCreate": {
        $gte: ISODate("2019-07-24T21:00:00.000+0000")
    }
});

cursor.forEach(function (claim) {
    if (claim.fields != (undefined && null) && claim.fields.sequenceValue != (undefined && null)) {
        var seq = claim.fields.sequenceValue;
        for (var i = 0; i < seq.length; i++) {
            if (seq[i].stringId) {
                var strId = seq[i].stringId

                if (strId == "ulAdr" || strId == "addressReg" || strId == "ulAdrTrust" || strId == "addressRegTrust") {
                    break;

                } else if (strId != "ulAdr" && strId != "addressReg" && strId != "ulAdrTrust" && strId != "addressRegTrust" && i == seq.length - 1) {
                    var ccn = claim.customClaimNumber;
                    print(ccn + ' ' + i);
                }
            }
        }
    }
})