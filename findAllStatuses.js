var cursor = db.claims.find({
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0000"),
        $lte: ISODate("2019-01-03T00:00:00.000+0000")
    },
    $or: [{
        "resultStatus": "3"
    }, {
        "resultStatus": "4"
    }],
    "customClaimNumber": /^50.*/i,
    "currStatus.statusCode": "41"
});

cursor.forEach(function (claim){
    var id = claim._id.valueOf();
    var findStatus = db.claims_status.find({ "claimId": id }).sort({"statusDate": 1}).toArray();
    var ccn = claim.customClaimNumber;
    var arr = [];
    for (var i = 0; i < findStatus.length; i++){
        arr.push(findStatus[i].statusCode);
    }
   
    print(ccn + ";" + arr);
})