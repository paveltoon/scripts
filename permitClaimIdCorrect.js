var remotes = {
    "DEV" : {
        server: "eisgmu-rldd-int-rs1-dev:27017",
        db: "mbkt-develop"
    },
    "PROD" : {
        server: "10.10.80.32:27017",
        db: "mbkt"
    }
}
// Pick DEV or PROD connection
var remoteConn = new Mongo(remotes.PROD.server);
var remote = remoteConn.getDB(remotes.PROD.db);

// Localhost connection to save lost claims
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
}).limit(1).forEach(function (permit) {
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