var cursor = db.claims.find({ "currStatus": { $exists: true }, "currStatus.claimId": { $exists: false } });
cursor.forEach(function(claim){
    var id = claim._id.valueOf();
    claim.currStatus.claimId = id;
    
    db.claims.save(claim);
    	
    print(id + " / " + claim.currStatus.claimId);
});