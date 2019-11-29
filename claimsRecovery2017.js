var sourceDB = db.claims_2017;
var sourceStatusesDB = db.claims_status_2017;

var count = 0;
var total = 0;

var cursor = sourceDB.find({
    "customClaimNumber": {
        $in: [
            "P001-1076930138-5293961",
            "P001-1076930138-9234876",
            "P001-1076930138-5623053",
            "P001-1076930138-5787236",
            "P001-1076930138-9318289",
            "P001-1076930138-9547961",
            "P001-1076930138-9306449",
            "P001-1076930138-9307552",
            "P001-1076930138-7686015",
            "P001-1076930138-5885216"
        ]
    }
}); 

cursor.forEach(function (claim) {

    if (typeof claim._id == 'ObjectId') {
        var cId = ObjectId(claim._id.valueOf());
    } else {
        var cId = claim._id.valueOf();
    }

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