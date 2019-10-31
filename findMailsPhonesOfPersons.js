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

print("Номер заявки;Дата создания заявки;Email;Телефон;Дата рождения")

var cursor = db.claims.find({

    "creatorDeptId": "mfc-mytishi-karla-marksa",
    "claimCreate": {
        $gte: ISODate("2019-09-01T00:00:00.000+0000"),
        $lte: ISODate("2019-10-01T00:00:00.000+0000")
    },
    "consultation": false,
    "oktmo": {
        $ne: "99999999"
    } 
    
});

cursor.forEach( function(claim){

    var birthDate = new Date(claim.personsInfo[0].dateOfBirth);
    var ccn = claim.customClaimNumber;
    var claimCreate = getActualDate(claim.claimCreate);
    function dataFind( name, ownType ) {
        var eml = claim.personsInfo[0].contacts;
        for (var i in eml) {
            if (eml[i].type == ownType){
                return eml[i].value;
            } else if (i == eml.length-1 && eml[i].type != ownType) {
                return name + " отсутствует";
            }
        }
    }
    var eml = dataFind("Email", "EML");
    var phn = dataFind("Телефон", "MBT")
    print(ccn + ';' + claimCreate + ';' + eml + ';' + phn + ';' + getActualDate(birthDate));
})