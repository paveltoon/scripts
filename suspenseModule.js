function getDayOfYear(date) {
    var month = date.getMonth();
    var year = date.getFullYear();
    var days = date.getDate();
    for (var i = 0; i < month; i++) {
        days += new Date(year, i + 1, 0).getDate();
    }
    return days;
};

function addDaysToDate(date, days) {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return new Date(newDate)
}

function getCalendar(year) {
    var calendar = db.calendars.findOne({
        $and: [{
                "year": year
            },
            {
                "oktmo": ""
            }
        ]
    });

    if (calendar == undefined || calendar == null) {
        return "Not found";
    } else {
        return calendar.daysOff;
    }
};

function daysBetweenDates(dateFirst, dateSecond) {
    var first = dateFirst.setHours(0, 0, 0, 0);
    var second = dateSecond.setHours(0, 0, 0, 0);
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

db.claims.find({
    "customClaimNumber": "P001-5475020493-22626042"
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origClaimId = claim._id;

    // -------------- COPY FROM HERE --------------//
    var totalSuspenseDays = 0;
    if (claim.suspenseReason != undefined) {

        var suspenseReason = claim.suspenseReason;
        var startDate = suspenseReason.createDate;
        var suspenseCalendar = getCalendar(startDate.getFullYear());
        var incDays = 0;

        // if totalSuspenseDays + daysDiff < 0 -> decrement from daysToDeadline
        if (claim.currStatus.statusCode == "70") {
            // If Working Days
            if (suspenseReason.workingDays === true) {
                var count = 0;
                var daysCheck = getDayOfYear(startDate);
                // Calculate calendar days
                while (count < suspenseReason.suspenseDays) {
                    if (suspenseCalendar.includes(daysCheck)) {
                        daysCheck++;
                        incDays++;
                    } else {
                        daysCheck++;
                        count++;
                    }
                    // If new year is coming
                    if (daysCheck >= 365) {
                        daysCheck = 1;
                        suspenseCalendar = getCalendar(startDate.getFullYear() + 1);
                    }
                }
            }
            // totalSuspenseDays = перевод в календарные дни; Столько дней прибавляем к deadlineDate
            totalSuspenseDays = incDays + suspenseReason.suspenseDays;

            // Сколько дней прошло
            var daysGone = daysBetweenDates(new Date(), startDate);

            // Сколько дней осталось на данный момент
            var susDays = totalSuspenseDays + daysGone;
            var susUpd = db.claims.update({
                "_id": origClaimId
            }, {
                $set: {
                    suspenseDays: NumberInt(susDays)
                }
            });
            print(totalSuspenseDays)
            print("Осталось дней до окончания приостановки: " + susDays + ' ' + (susUpd.nModified == 1 ? "(Corrected)" : "(Not Corrected)"))
        } else {

            var find70Status = db.claims_status.find({
                "claimId": origClaimId.valueOf()
            }).sort({
                "statusDate": 1
            }).toArray();

            for (var i = 0; i < find70Status.length; i++) {
                var status = find70Status[i];
                if (status.statusCode == "70" && find70Status[i + 1] != undefined) {
                    var nextStatus = find70Status[i + 1];
                    //Разница в днях между статусами
                    var statusDiff = daysBetweenDates(status.statusDate, nextStatus.statusDate);
                    // Добавление дней к дедлайну
                    totalSuspenseDays += statusDiff;

                }
            }

            print(totalSuspenseDays)

        }
    }
})