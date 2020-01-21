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
    var firstStatus = db.claims_status.find({ "claimId": origId }).sort({"statusDate": 1});
    if(firstStatus[0] != undefined && firstStatus[0].statusDate != undefined){
        var rigthDateCreate = firstStatus[0].statusDate;
        var rightDate = new Date(rigthDateCreate)
    
        if(claimCreate > rightDate.setHours(rightDate.getHours() + 1 )){
            iter++;
            bulk.find({ 'customClaimNumber': ccn }).update( { $set: { "claimCreate": rigthDateCreate, "createDate": rigthDateCreate } });
            if(iter % 1000 == 0){
                bulk.execute();
                bulk = db.claims.initializeUnorderedBulkOp();
            }
            print(ccn);
        }
    } else {
        print('[WARNING] ' + ccn + ' Have no statuses!')
    }
});
print('Count of claims: ' + iter)
bulk.execute();