var source = 'xxx_claims_from_mku';
var target = 'claims';
var count = 0;
var bulk = db.getCollection(target).initializeUnorderedBulkOp();

var cursor = db.getCollection(target).find({
    "service.srguServiceId": {
        $exists: false
    },
    "activationDate": {
        $gte: ISODate("2019-12-21T21:00:00.000+0000")
    }
})
cursor.forEach(function (claim) {

    var ccn = claim.customClaimNumber;

    var sourceFind = db.getCollection(source).findOne({
        "customClaimNumber": ccn
    });

    if (sourceFind != (undefined && null) && sourceFind.service != (undefined && null) && sourceFind.service.srguServiceId != (undefined && null)) {
        var srgu = sourceFind.service.srguServiceId;

        bulk.find({
            "customClaimNumber": ccn
        }).update({
            $set: {
                "service.srguServiceId": srgu
            }
        });

        if (count % 1000 == 0) {
            bulk.execute();
            bulk = db.getCollection(target).initializeUnorderedBulkOp();
        }

        count++;
    }

});

bulk.execute();
print(count);