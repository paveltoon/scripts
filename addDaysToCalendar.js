var newDays = [
    97,
    98,
    99,
    100,
    101,
    104,
    105,
    106,
    107,
    108,
    111,
    112,
    113,
    114,
    115,
    118,
    119,
    120,
    121,
]
db.calendars.find({
    "year": NumberInt(2020)
}).forEach(function (cal) {
    var id = cal._id;
    var daysOff = cal.daysOff;

    for (var i in newDays) {
        daysOff.push(newDays[i]);
    }
    for (var j in daysOff) {
        daysOff[j] = NumberInt(daysOff[j])
    }

    var upd = db.calendars.update({
        "_id": id
    }, {
        $set: {
            "daysOff": daysOff
        }
    });
    print(id + ' ' + upd.nModified + ' / ' + upd.nMatched)
})