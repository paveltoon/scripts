var remoteConn = new Mongo("eisgmu-rldd-int-rs1-dev:27017");
var remote = remoteConn.getDB('mbkt-develop');

var localConn = new Mongo("localhost:27017");
var local = localConn.getDB('permit-claims');

remote.permits.find({
    "code": {
        $exists: true
    },
    "parsedSms.scenario": "1",
    "claimId": {
        $exists: false
    }
}).forEach(function (permit) {
    var permitId = permit._id;
    var code = permit.code;
    var ccn = "MBKT-" + code.split('').splice(0, 8).join('') + "-" + code.split('').splice(8).join('');

    var prodClaim = db.claims.findOne({
        "customClaimNumber": ccn
    });
    if (prodClaim != undefined && prodClaim._id != undefined) {
        var prodClaimId = prodClaim._id;
    } else {
        print(ccn + ' claim doesnt found.')
        var localSearch = local.lostPermits.findOne({"code" : code});
        if (localSearch == undefined) {
            local.lostPermits.save({
                "code" : code,
                "ccn" : ccn,
                "lastModified": new Date()
            })
        }
        return;
    }
    var upd = remote.permits.update({
        "_id": permitId
    }, {
        $set: {
            "claimId": prodClaimId.valueOf()
        }
    });

    print("Permit with ID: " + permitId + " has been changed. progress: " + upd.nModified + ' / ' + upd.nMatched)
})