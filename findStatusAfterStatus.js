var cursor = db.claims.find({
    "service.srguServicePassportId": "5000000000187909031",
    "claimCreate": {
        $gte: ISODate("2019-10-28T00:00:00.000+0000")
    }
});

cursor.forEach(function(claim){
    var origId = claim._id.valueOf();
    var statuses = db.claims_status.find({"claimId": origId}).sort({"statusDate": 1}).toArray();

    for( var i = 0; i < statuses.length-1; i++ ) {
        if ( statuses[i].statusCode == "22" && statuses[i + 1].statusCode == "53" ){
            print(origId);
            return;
        }
    }

})