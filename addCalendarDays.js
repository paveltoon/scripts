db.calendars.find({
    "year": NumberInt(2020)
}).forEach(function (calendar) {
    var id = calendar._id;
    var daysOff = calendar.daysOff;
    
    daysOff.push(127, 128, 129)

    for(var i in daysOff) {
        daysOff[i] = NumberInt(daysOff[i])
    }

    var upd = db.calendars.update({"_id": id}, {
        $set: {
            "daysOff": daysOff
        }
    });

    print(id.valueOf() + ' ' + upd.nModified + ' / ' + upd.nMatched)
})