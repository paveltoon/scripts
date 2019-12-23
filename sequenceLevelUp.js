var cursor = db.claims.find({
    "service.srguServiceId": "5000000010000020897",
    "fields": {
        $exists: true
    }
});

cursor.forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var sequence = claim.fields.sequenceValue;

    if(sequence != 0 && sequence[0].title == "Сведения об умершем"){
        claim.fields.sequenceValue = sequence[0].sequenceValue;
        db.claims.save(claim);
        print(ccn + ' Done.')
    } else {
        print(ccn + ' Already corrected')
    }
    
})