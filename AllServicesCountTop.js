var allServices = db.claims.distinct("service.srguServicePassportId");
printjson(allServices)
for (var i = 0; i < allServices.length; i++) {
    var claimsNow = db.claims.find({
      "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" },
        "service.srguServicePassportId": allServices[i],
        "senderCode": "IPGU01001"
    }).count();
    var claims2015 = db.claims_2015.find({
      "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" },
        "service.srguServicePassportId": allServices[i],
        "senderCode": "IPGU01001"
    }).count();
    var claims2016 = db.claims_2016.find({
      "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" },
        "service.srguServicePassportId": allServices[i],
        "senderCode": "IPGU01001"
    }).count();
    var claims2017 = db.claims_2017.find({
      "currStatus.statusCode": { $ne: "86" }, "oktmo": { $ne: "99999999" },
        "service.srguServicePassportId": allServices[i],
        "senderCode": "IPGU01001"
    }).count();
    if (claimsNow != null && claimsNow != undefined) {
      var claimsAll = +claimsNow + +claims2015 + +claims2016 + +claims2017;
        print(allServices[i] + ';' + claimsAll)
    }
}