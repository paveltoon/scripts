function getActualDate(date){
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();
 
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
 
	return(dt + '.' + month + '.' + year);
};

var cursor = db.claims.find({ "service.srguServicePassportId": { $in: ["5000000000182799258", "5000000000167433775"] } });

cursor.forEach( function(claim){
    var ccn = claim.customClaimNumber;
    var ccnDate = claim.claimCreate;
    var servName = claim.service.srguServicePassportName;
    var fields = claim.fields;
    
    if (fields && fields.sequenceValue){
        var seq = claim.fields.sequenceValue;
        
        for (var i = 0; i < seq.length; i++){
            if(seq[i].stringId == "sotrydnikZags"){
                print(ccn + ';' + getActualDate(ccnDate) + ';' + servName);
                return;
            }
        }
    } 
    
});