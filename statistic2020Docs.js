var req = {
  "claimCreate": {
    $gte: ISODate("2019-12-31T21:00:00.000+0000")
  },
  "oktmo": {
    $ne: "99999999"
  },
  "consultation": false
}

// Variables

var rpgu_all = 0
var rpgu_result = 0
var etc_all = 0
var etc_result = 0

var current_step = 0
var total_count = db.claims.find(req).count()

// Code
db.claims.find(req).forEach((claim) => {
  current_step++;
  var progress = Math.round((current_step / total_count) * 100)
  var claim_id = claim._id;
  if (claim.senderCode != undefined) {
    docs = db.docs.find({
      "ownerId": claim_id.valueOf()
    }).toArray();
    for (var d in docs) {
      var doc = docs[d];
      if (claim.senderCode == "IPGU01001") {
        rpgu_all ++;
      } else {
        etc_all ++;
      }

      if (doc.title != undefined) {
        if (doc.title.indexOf("Результат") != -1 || doc.title.indexOf("Решение") != -1 || doc.title.indexOf("Отказ") != -1) {
          if (claim.senderCode == "IPGU01001") {
            rpgu_result ++;
          } else {
            etc_result ++;
          }
        }
      }
    }
  }

  if (current_step % 10000 == 0) {
    print(`${current_step} / ${total_count}. ${progress}%`)
  }


})

print(rpgu_all, etc_all, rpgu_result, etc_result)