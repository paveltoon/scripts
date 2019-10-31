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

var cursorResultTrue = db.claims.find({
    "oktmo": "46606000",
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0000") 
    }
    ,
    "daysToDeadline": {
        $lt: NumberInt(0) 
    }
    ,
    "resultStatus": {
        $exists: true 
    }
    ,
    "consultation": false,
    "service.srguServicePassportId": {
        $in: [
"5000000000210845197",
"5000000000210616921",
"5000000000196302121",
"5000000000197484426",
"5000000000167013387",
"5000000000184667175",
"5000000010000192078",
"5000000010000192146",
"5000000000184750304",
"5000000000196795211",
"5000000000196793213",
"5000000000195848262",
"5000000010000052393",
"5000000000186738673",
"5000000000186738813",
"5000000000186738601",
"5000000000184561879",
"5000000000167107798",
"5000000000160296849",
"5000000000166999894",
"5000000000186843536",
"5000000000186836729",
"5000000000186876627",
"5000000000178113202",
"5000000000185787336",
"5000000000185430600",
"5000000000167003647",
"5000000000186973891",
"5000000000178047496",
"5000000000178113239",
"5000000000178112908",
"5000000000177914050",
"5000000000178112832",
"5000000000178113091"
        ]
    }
}
);

cursorResultTrue.forEach(function (claim){
 
    var statuses = [];
    var id = claim._id.valueOf();
   
    var findstatus = db.claims_status.find({"claimId": id}).sort({"statusDate": 1}).toArray();
    for ( var i = 0; i < findstatus.length; i++){
        statuses.push(findstatus[i].statusCode, getActualDate(findstatus[i].statusDate))
    }
    var statusToPrint = statuses.splice("").join(";");
    print(claim.oktmo + ';' + getActualDate(claim.claimCreate) + ';' + claim.customClaimNumber + ';' + claim.currStatus.statusCode + ';' + getActualDate(claim.currStatus.statusDate) + ';' + claim.daysToDeadline + ';' + claim.service.srguServicePassportName + ';' + claim.service.srguServicePassportId + ';' + claim.service.name + ';' + claim.service.srguDepartmentName + ';' + statusToPrint)
});