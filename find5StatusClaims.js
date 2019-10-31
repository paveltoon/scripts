var cursor = db.claims.find({
    "service.srguServicePassportId": "5000000000192716264",
    "claimCreate": {
        $gte: ISODate("2019-08-01T00:00:00.000+0000"),
        $lte: ISODate("2019-10-07T00:00:00.000+0000")
    },
    "resultStatus": {
        $exists: true
    }
});
print("Номер заявки;Наименование процедуры;Депт;Текущий статус;Комментарий")
cursor.forEach(function(claim){
    var origId = claim._id.valueOf();
    var status5 = db.claims_status.findOne({ "claimId": origId, "statusCode": "5" });
    if (status5 != null && status5.statusCode == "5") {
        var statuses = db.claims_status.find({"claimId": origId, $or: [ { "statusCode": "24" }, { "statusCode": "52" } ]}).sort({"statusDate": 1}).toArray();
        for (var i = 0; i < statuses.length; i++){
          if( statuses[i].comment != undefined){
        	print(claim.customClaimNumber + ';' + claim.service.name + ';' + statuses[i].deptId + ';' + claim.currStatus.statusCode + ';' + statuses[i].comment);
        	return;
          }
        }
    }
})