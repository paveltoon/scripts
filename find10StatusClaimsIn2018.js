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

var statuses = db.claims_status.find({
  "statusCode": "10",
  "statusDate": {
    $gte: ISODate("2017-12-31T21:00:00.000+0000"),
    $lte: ISODate("2018-12-31T21:00:00.000+0000")
  }
});

statuses.forEach(function (stat) {
  var origId = stat.claimId;
  var statDate = getActualDate(stat.statusDate);
  var claim = db.claims.findOne({
    "currStatus.claimId": origId
  });

  if ( claim != (undefined && null) && claim.claimCreate > ISODate("2017-12-31T21:00:00.000+0000") && claim.claimCreate < ISODate("2018-12-31T21:00:00.000+0000")) {

    if (claim.service != (undefined && null)) {
      var ccn = claim.customClaimNumber;
      print(ccn + ';' + claim.service.srguServicePassportName + ';' + claim.service.srguServicePassportId + ';' + claim.service.srguDepartmentName + ';' + getActualDate(claim.claimCreate) + ';' + statDate);
    } else {
      print(claim.customClaimNumber + " Have no service data");
    }
  }
})