var origIds = [
    "49a7bd4f-a156-499a-a6a7-eab6d2982ff4",
    "3f02e12a-137c-41f7-b9fb-4831c6ddff3f",
    "be80ed77-ab55-4ea1-b9ab-a625aea32430",
    "fe142b52-45d2-4d17-b841-f3259849fb14",
    "332e6631-d1bc-4644-977c-351bde48ca60"
];

for (var i = 0; i < origIds.length; i++) {
    var cursor = db.ctx.findOne({
        "requestTypeId": origIds[i]
    });
    if (cursor == null || cursor == undefined) {
        print(origIds[i] + " Have no SMEV request")
    } else
    if (cursor.currentStep == "2" && cursor.status != ("ERROR" && "DONE")) {
        var upd = db.ctx.update({
            "requestTypeId": origIds[i]
        }, {
            $set: {
                "status": "INITIAL"
            },
            $unset: {
                "messageId": ""
            }
        }, {
            multi: true
        });
        print(upd.nModified + ' / ' + upd.nMatched);
    }
}