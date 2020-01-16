var cursor = db.claims.find({
    "provLevel": "Услуги организаций",
    "activationDate": {
        $gte: ISODate("2019-12-21T21:00:00.000+0000")
    }
});

cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    if (claim.service != undefined) {
        var srguCode = claim.service.srguServiceId;
        var passCode = claim.service.srguServicePassportId;
        var srgus = db.dictionaries.find({});
        if (srgus[0].sections[3].definitions[srguCode] != undefined) {
            var provlevel = srgus[0].sections[3].definitions[srguCode];
            var upd = db.claims.update({
                "customClaimNumber": ccn,
                "provLevel": "Услуги организаций"
            }, {
                $set: {
                    "provLevel": provlevel
                }
            }, {
                multi: true
            });
            print(ccn + ' ' + provlevel + ' , Corrected: ' + upd.nModified + ' / ' + upd.nMatched)
        } else if (srgus[0].sections[0].definitions[passCode] != undefined) {
            var provlevel = srgus[0].sections[0].definitions[passCode];
            var upd = db.claims.update({
                "customClaimNumber": ccn,
                "provLevel": "Услуги организаций"
            }, {
                $set: {
                    "provLevel": provlevel
                }
            }, {
                multi: true
            });
            print(ccn + ' ' + provlevel + ' , Corrected: ' + upd.nModified + ' / ' + upd.nMatched)
        }
    }
});