var bulk = db.claims.initializeUnorderedBulkOp();
var iter = 0;
var cursor = db.claims.find({
    "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000"),
        $lte: ISODate("2020-01-06T21:00:00.000+0000")
    }
});
cursor.forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var claimCreate = claim.claimCreate;
    var origId = claim._id.valueOf();
    if(claim.activationDate != undefined){
        var activationDate = claim.activationDate;
        if(claimCreate > activationDate){
            iter++;
            bulk.find({ 'customClaimNumber': ccn }).update( { $set: { "claimCreate": activationDate, "createDate": activationDate } });
            if(iter % 1000 == 0){
                bulk.execute();
                bulk = db.claims.initializeUnorderedBulkOp();
            }
            print(ccn);
        }
    }
});
bulk.execute();