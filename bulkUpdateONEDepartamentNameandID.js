var idMap = [
    "5000000000163644128"
];

var nameMap = [
    'Главное управление Московской области «Государственная жилищная инспекция Московской области»'
];

var bulk = db.claims.initializeUnorderedBulkOp();

for (var i = 0; i < idMap.length; i++) {
    var cursor = bulk.find({
        "service.srguServicePassportId": idMap[i]
    }).update({
        $set: {
            "service.srguDepartmentName": nameMap[i],
            "service.srguDepartmentId" : "5000000010000000458"
        }
    });

}

bulk.execute();