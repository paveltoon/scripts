db.claims.find({
  "service.srguServiceId": "5000000000195673983",
  "claimCreate": {
    $gte: ISODate("2020-05-23T21:00:00.000+0000")
  }
}).forEach((claim) => {
  var claimId = claim._id;
  var docs = db.docs.find({
    "ownerId": claimId.valueOf()
  }).toArray()

  for (var d in docs) {
    var doc = docs[d]

    if (doc.title === "Схема расположения земельного участка на кадастровом плане территории") {
      var docId = doc._id
      var upd = db.docs.update({
        "_id": docId
      }, {
        $set: {
          "title": "Схема расположения земельного участка"
        }
      })
      print(`Doc ${docId.valueOf()} has been updated. progress: ${upd.nModified} / ${upd.nMatched}`)
    }

    if (doc.type != undefined && doc.type.title === "Схема расположения земельного участка на кадастровом плане территории") {
      var docId = doc._id
      var upd2 = db.docs.update({
        "_id": docId
      }, {
        $set: {
          "type.title": "Схема расположения земельного участка"
        }
      })
      print(`Doc ${docId.valueOf()} has been updated. progress: ${upd2.nModified} / ${upd2.nMatched}`)
    }

    if (doc.type != undefined && doc.type.desc === "Схема расположения земельного участка на кадастровом плане территории") {
      var docId = doc._id
      var upd3 = db.docs.update({
        "_id": docId
      }, {
        $set: {
          "type.desc": "Схема расположения земельного участка"
        }
      })
      print(`Doc ${docId.valueOf()} has been updated. progress: ${upd3.nModified} / ${upd3.nMatched}`)
    }

  }
})