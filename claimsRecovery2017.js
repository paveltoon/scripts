var sourceDB = db.claims_2017;
var sourceStatusesDB = db.claims_status_2017;

var count = 0;
var total = 0;

var cursor = sourceDB.find({
    "customClaimNumber": {
        $in: [
            "P001-6189067611-9601380"
        ]
    }
}); 

cursor.forEach(function (claim) {

    var cId = claim._id;
    var origId = claim._id.valueOf();
    var ccn = claim.customClaimNumber;

    var statusesCursor = sourceStatusesDB.find({
        "claimId": origId
    });

    // Insert Claim & Statuses
    statusesCursor.forEach(function (stat){
        db.claims_status.insert(stat);
    });
    
    db.claims.insert(claim);

    // Delete Claim & Statuses from Source collection
    var targetClaim = db.claims.findOne({ "_id": cId });

    var targetStatuses = db.claims_status.find({
        "claimId": origId
    });

    // Test claim & statuses inserts
    if (targetClaim.customClaimNumber == claim.customClaimNumber && targetStatuses.length == statusesCursor.length){
        sourceDB.remove({
            "customClaimNumber": ccn
        });
        sourceStatusesDB.remove({
            "claimId": origId
        })
        print('Claim moved with ID: ' + origId)
        count++;
    } else {
        print('Have some problems? ID: ' + origId)
    }

    total++;

});

print('Claims: ' + count + ' / ' + total);