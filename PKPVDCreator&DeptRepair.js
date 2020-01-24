function checkDept(num) {
    var result = num.split("/");
    switch (result[3]) {
        case "009":
        case "101":
            return "mfc-krasnogorsk";
        case "011":
        case "103":
            return "mfc-krasnogorsk-dachnoe";
        case "012":
        case "104":
            return "mfc-nahabino";
        case "013":
        case "105":
            return "mfc-krasnogorsk-mechnikovo";
        case "014":
        case "106":
            return "mfc-krasnogorsk2";
        case "010":
        case "102":
            return "mfc-krasnogorsk-pp";
    }
}
var cursor = db.claims.find({
    "senderCode": "RRTR01001",
    "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000")
    },
    "oktmo": "46744000"
}).forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var dept = checkDept(ccn);
    if(dept){
        var upd = db.claims.update(
            { "customClaimNumber": ccn },
            { $set: { "deptId": dept, "creatorDeptId": dept } },
            { multi: true }
        );
        print("Claim: " + ccn + " has been corrected. deptId: " + dept + ". Progress: " + upd.nModified + " / " + upd.nMatched);
    }
});