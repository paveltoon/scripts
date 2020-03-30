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
    "customClaimNumber": "M503-3391240646-22609954"
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origClaimId = claim._id;
    if (claim.suspenseReason != undefined) {

        var suspenseReason = claim.suspenseReason;
        var startDate = suspenseReason.createDate;
        var suspenseCalendar = getCalendar(startDate.getFullYear());
        var incDays = 0;
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
        // TotalDays = перевод в календарные дни;
        var totalDays = incDays + suspenseReason.suspenseDays;

        // Сколько осталось daysToDeadline во время приостановки
        var daystoDeadlineSuspense = daysBetweenDates(startDate, claim.deadlineDate)

        // if totalDays + daysDiff < 0 -> decrement from daysToDeadline
        if (claim.currStatus.statusCode == "70") {
            // Сколько дней прошло
            var daysGone = daysBetweenDates(new Date(), startDate);
            // Сколько дней осталось на данный момент
            var susDays = totalDays + daysGone;
            // Новый дедлайн
            var deadDate = addDaysToDate(claim.deadlineDate, totalDays);
            // Дата, когда выйдет из приостановки
            var deadSuspenseDate = addDaysToDate(startDate, totalDays);

            print("Дедлайн заявки: " + claim.deadlineDate)
            print("Дата приостановки: " + startDate)
            print("Новый дедлайн с приостановкой: " + deadDate)
            print("Дата окончания приостановки: " + deadSuspenseDate)
            print("Всего дней приостановки: " + totalDays)
            print("Осталось дней до окончания приостановки: " + susDays)
            print("Останется дней дедлайна: " + daystoDeadlineSuspense)
        } else {
            var find70Status = db.claims_status.find({
                "claimId": origClaimId.valueOf()
            }).sort({
                "statusDate": 1
            }).toArray();

            var newDeadline = new Date(claim.deadlineDate)

            for (var i = 0; i < find70Status.length; i++) {
                var status = find70Status[i];
                if (status.statusCode == "70" && find70Status[i + 1] != undefined) {
                    var nextStatus = find70Status[i + 1];
                    //Разница в днях между статусами
                    var statusDiff = daysBetweenDates(status.statusDate, nextStatus.statusDate);
                    // Добавление дней к дедлайну
                    newDeadline = addDaysToDate(newDeadline, statusDiff);
                    //Проверка на количество дней оставшихся до дедлайна
                    var daystoDeadlineSuspense = daysBetweenDates(status.statusDate, newDeadline)
                    print(daystoDeadlineSuspense)
                    print(newDeadline)
                }
            }
            
        }
    }
})