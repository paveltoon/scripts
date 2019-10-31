var idMap = [
    "5000000000185675394"
];

var nameMap = [
    "Предоставление права и оформление лицензий на участки недр (подземная вода)"
];

var bulk = db.claims.initializeUnorderedBulkOp();

for (var i = 0; i < idMap.length; i++) {
    var cursor = bulk.find({
        "service.srguServicePassportId": idMap[i]
    }).update({
        $set: {
            "service.srguServicePassportName": nameMap[i]
        }
    });

}

bulk.execute();