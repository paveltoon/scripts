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

var cursor = db.claims.find({
    "service.srguServicePassportId": "5000000010000047449",
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0300"),
        $lte: ISODate("2019-07-24T00:00:00.000+0300")
    },
    "resultStatus": {
        $exists: true
    },
    "docSendDate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0300"),
        $lte: ISODate("2019-07-24T00:00:00.000+0300")
    }
});

cursor.forEach(function (claim) {
    var id = claim._id.valueOf();
    var ccn = claim.customClaimNumber;
    var arend = "Копия договора аренды транспортного средства, которое предполагается использовать для оказания услуг по перевозке пассажиров и багажа легковым такси, заверенная заявителем, с приложением акта приема-передачи транспортного средства";
    var natorial = 'Нотариально заверенная доверенность на право распоряжения транспортным средством';
    var lizing = 'Копия договора лизинга транспортного средства, которое предполагается использовать для оказания услуг по перевозке пассажиров и багажа легковым такси, заверенная заявителем, с приложением акта приема-передачи транспортного средства'

    var docFind = db.docs.find({
        "ownerId": id
    }).toArray();
    for (var i = 0; i < docFind.length; i++) {
        var docTitle = docFind[i].title;
        if (docTitle == arend) {
            print(ccn + ' ' + getActualDate(claim.claimCreate) + ' ' + getActualDate(claim.docSendDate) + ' ' + claim.resultStatus + ' Аренда');
            return;
        } else if (docTitle == natorial) {
            print(ccn + ' ' + getActualDate(claim.claimCreate) + ' ' + getActualDate(claim.docSendDate) + ' ' + claim.resultStatus + ' Нотариальная доверенность');
            return;
        } else if (docTitle == lizing) {
            print(ccn + ' ' + getActualDate(claim.claimCreate) + ' ' + getActualDate(claim.docSendDate) + ' ' + claim.resultStatus + ' Лизинг');
            return;
        } else if (i == docFind.length - 1 && docTitle != arend && docTitle != natorial && docTitle != lizing) {
            print(ccn + ' ' + getActualDate(claim.claimCreate) + ' ' + getActualDate(claim.docSendDate) + ' ' + claim.resultStatus + ' Собственность');
            return;
        }
    }
});