function getActualDate(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    
    return (dt + '.' + month + '.' + year);
};
print("Номер заявления;Дата создания;ОКТМО;pnStep2S0AcodeOszn;mfc1.value;mfc1.title")
var cursor = db.claims.find({
    "service.srguServiceId": "5000000000213945358",
    "activationDate": {
        $gte: ISODate("2019-12-12T21:00:00.000+0000")
    },
    "customClaimNumber": /^P001.*/i
});

cursor.forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var claimCreate = getActualDate(claim.claimCreate);
    var oktmo = claim.oktmo;

    if(claim.fields && claim.fields.sequenceValue) {
        var fields = claim.fields.sequenceValue;
        for(var i in fields){
            if(fields[i].stringId == "pnStep2S0AcodeOszn") {
                var socialOrg = fields[i].value
            } else if(fields[i].stringId == "mfc1") {
                var mfcValue = fields[i].value;
                var mfcTitle = fields[i].title;
            }
        }
        print(ccn + ';' + claimCreate + ';' + oktmo + ';' + socialOrg + ';' + mfcValue + ';' + mfcTitle);
    }
});