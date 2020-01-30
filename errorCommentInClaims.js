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

db.claims.find({
  	//"customClaimNumber": "M503-4605339999-30517527",
    "service.srguServicePassportId": "5000000010000000897",
    "activationDate": {
        $gte: ISODate("2019-10-31T21:00:00.000+0000"),
        $lte: ISODate("2020-01-28T21:00:00.000+0000")
    }
}).forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var dept = claim.deptId;
    var activationDate = getActualDate(claim.activationDate);
    var origId = claim._id.valueOf();
    if(dept == (undefined || null) || dept == ''){
        var findDept = db.claims_status.find({"claimId": origId, "deptId": { $exists: true }}).sort({"statusDate": -1});
        if(findDept[0] != (undefined && null)){
            dept = findDept[0].deptId;
        } else {
            dept = '';
        }
    }
    var findErrorStatus = db.claims_status.find({ "claimId": origId, "comment": /.*ошибка.*/i }).toArray();
    if(findErrorStatus[0] != (undefined && null)){
        var errorString = findErrorStatus[0].comment.split('\r\n').join(' ');
        print(ccn + ';' + activationDate + ';' + dept + ';' + getActualDate(findErrorStatus[0].statusDate) + ';' + errorString)
    }
})