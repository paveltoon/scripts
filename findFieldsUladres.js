var cursor = db.claims.find({
    "senderCode": "IPGU01001",
    "service.srguServicePassportId": "5000000000163644128",
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0300")
    }
});

cursor.forEach(function (claim) {
    if (claim.fields != (undefined && null) && claim.fields.sequenceValue != (undefined && null)) {
        var seq = claim.fields.sequenceValue;
        for (var i = 0; i < seq.length; i++) {
            if (seq[i].stringId) {
                var strId = seq[i].stringId

                if (strId == "ULadres" || strId == "AdresRegist") {

                    break;

                } else if (strId != "ULadres" && strId != "AdresRegist" && i == seq.length - 1) {
                    var ccn = claim.customClaimNumber;
                    print(ccn);
                }
            }
        }
    }
})