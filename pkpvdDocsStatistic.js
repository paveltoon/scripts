var iter = 0;
db.rs_appeal.find({
  "internalNum": "MFC-0555/2020-77714"
}).forEach(claim => {
  var documents = claim.documents;
  if (iter <= 0) {
    print("ID;Имя файла;MD5;Номер заявки;Серия;Номер;Сумма;Название документа")
    iter++;
  }
  for (var d in documents) {
    var doc = documents[d];
    var doc_id = doc._id != undefined ? doc._id : '';
    var ser = doc.series != undefined ? doc.series : '';
    var num = doc.number != undefined ? doc.number : '';
    var sum = doc.sum != undefined ? doc.sum.toString().substring(0, doc.sum.toString().length-2) : '';
    var imageName = doc.documentImage != undefined && doc.documentImage.imageFileName != undefined ? doc.documentImage.imageFileName : '';
    var imageMd5 = doc.documentImage != undefined && doc.documentImage.imageMd5 != undefined ? doc.documentImage.imageMd5 : '';
    var internalNum = doc.internalNum != undefined ? doc.internalNum : '';
    var docName = doc.name != undefined ? doc.name : '';


    var statements = claim.statements;
    var docFounded = false;
    for (var s in statements) {
      var state = statements[s]
      var stateInternalNum = state.internalNum;
      var doclist = state.documentGivenList;
      for (var i in doclist) {
        var document = doclist[i];
        var documentId = document.document;
        if (doc_id == documentId) {
          print(`${doc_id};${imageName};${imageMd5};${stateInternalNum};${ser};${num};${sum};${docName}`)
          docFounded = true;
          continue;
        } 
      }
      if (!docFounded) {
        var paymentList = state.documentPaymentList;
        for (var pay in paymentList) {
          var payElement= paymentList[pay];
          if (doc_id == payElement) {
            print(`${doc_id};${imageName};${imageMd5};${stateInternalNum};${ser};${num};${sum};${docName}`)
            docFounded = true;
            continue;
          }
        }
      }
    }
    if (!docFounded) {
      print(`${doc_id};${imageName};${imageMd5};${internalNum};${ser};${num};${sum};${docName}`)
    }
  }
})