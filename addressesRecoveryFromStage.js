var cursor = db.claims.find({
    "fields.sequenceValue.type": "REF",
    "activationDate": {
        $gte: ISODate("2019-12-21T00:00:00.000+0000"),
        $lte: ISODate("2020-01-06T00:00:00.000+0000")
    }
}).addOption(DBQuery.Option.noTimeout).forEach(function (claim) {
    var sequences = claim.fields.sequenceValue;
    var origId = claim._id.valueOf();
    var ccn = claim.customClaimNumber;
    for (var field in sequences) {
        if (sequences[field].type == "REF") {
            if (sequences[field].value && sequences[field].value.objectId) {
                if (sequences[field].value.objectId.length == 24) {
                    var addressId = ObjectId(sequences[field].value.objectId);
                } else {
                    var addressId = sequences[field].value.objectId;
                }

                var prodAddress = db.addresses.findOne({
                    "_id": addressId
                });
                if (prodAddress == undefined) {
                    var remoteConn = new Mongo("10.10.80.21:27018");
                    var stage = remoteConn.getDB('rldd2');
                    stage.auth({
                        user: "rlddService",
                        pwd: "1q2w3e4r"
                    });
                    var stageAddress = stage.addresses.findOne({
                        "_id": addressId
                    });
                    if (stageAddress != undefined) {
                        db.addresses.insert(stageAddress);
                        print("In claim: " + ccn + ", with id: " + origId + ", inserted address with id: " + addressId)
                    } else {
                        print("[WARNING] Claim: " + ccn + " have no address at STAGE, address id: " + addressId)
                    }
                } else {
                    print("[INFO] Claim: " + ccn + " already have at PROD, with address id: " + addressId)
                }
            } else {
                print("[WARNING] Claim: " + ccn + " have no values in fields")
            }
        }
    }
})