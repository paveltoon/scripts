function getId(id) {
  if (id.length == 24) {
    return ObjectId(id);
  } else {
    return id;
  }
}

db.claims.find({
  "claimCreate": {
    $gte: ISODate("2020-08-04T07:00:00.000+0000")
  },
  "service.srguServicePassportId": "5000000000178113239",
  "statuses.0.statusCode": "2",
  "resultStatus": {
    $exists: false
  }
}).forEach((claim) => {
  var id = claim._id;
  var ccn = claim.customClaimNumber;

  var bodyStatuses = claim.statuses;
  var isChanged = false;
  var statusesArr = [];

  // Удаление статусов в теле заявки
  for (var i = 0; i < bodyStatuses.length; i++) {
    var el = bodyStatuses[i];
    if (el.senderCode != undefined && el.senderName != undefined) {
      if (el.senderCode.startsWith('5') && el.senderName.startsWith('Администрация')) {
        var statusId = el.id;
        bodyStatuses.splice(i, 1)
        i -= 1;
        statusesArr.push(getId(statusId))
        isChanged = true;
      }
    }
  }
  // Принт и апдейт
  if (isChanged) {
    // Поиск последнего статуса
    var lastStatusId = getId(bodyStatuses[bodyStatuses.length - 1].id)
    var lastStatus = db.claims_status.findOne({"_id": lastStatusId})
    delete lastStatus._class
    // Апдейт заявки
    var upd = db.claims.update({"_id": id}, {$set: {"statuses": bodyStatuses, "currStatus": lastStatus}});
    // Удаление статусов в коллекции статусов
    var rem = db.claims_status.remove({ "_id": { $in: statusesArr } });
    print(`Removed ${rem.nRemoved} statuses from claim ${ccn}`);
  }
})