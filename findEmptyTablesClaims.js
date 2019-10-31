var cursor = db.claims.find({ "claimCreate": { $gte: ISODate("2019-10-15T00:00:00.000+0000") } });

cursor.forEach(function (claim){
    if(claim.fields != (undefined && null) && claim.fields.sequenceValue.length != 0){
        var fields = claim.fields.sequenceValue;
        for (var i in fields){
            if(fields[i].type == "SEQUENCE" && fields[i].sequenceValue.length == 0){
                print(claim.customClaimNumber);
                return;
            }
        }
    }
})