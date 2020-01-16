var cursor = db.claims.find({
    $and: [{
        $or: [{
            "deadlineStages": {
                $exists: false
            }
        }, {
            "deadlineStages.deadline": NumberInt(0)
        }]
    }, {
        $or: [{
            "service.instant": "false"
        }, {
            "service.instant": {
                $exists: false
            }
        }]
    }, {
        "activationDate": {
            $gte: ISODate("2019-12-20T21:00:00.000+0000")
        }
    }, {
        "service.name": {
            $not: /.*Без обработчика.*/i
        }
    }, {
        "customClaimNumber": {
            $not: /^K.*/i
        }
    }]
}).limit(100);
cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    if (claim.service != undefined) {
        var srgu = claim.service.srguServiceId;
        var srguName = claim.service.name;
        var passId = claim.service.srguServicePassportId;
        var passName = claim.service.srguServicePassportName;

        var sameClaim = db.claims.findOne({
            "activationDate": {
                $gte: ISODate("2019-12-01T21:00:00.000+0000"),
                $lte: ISODate("2019-12-19T21:00:00.000+0000")
            },
            "daysToDeadline": {
                $gt: NumberInt(0)
            },
            "service.srguServiceId": srgu,
            "deadlineStages": {
                $exists: true
            }
        });

        if (sameClaim != (undefined && null)) {
            var stageDays = sameClaim.deadlineStages[0].deadline;
            var stageWorkDays = sameClaim.deadlineStages[0].deadlineInWorkDays;

            var deadStages = sameClaim.deadlineStages;
            for (var i in deadStages) {
                deadStages[i].deadline = NumberInt(deadStages[i].deadline)
            }
            var upd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "deadlineStages": deadStages
                }
            }, {
                multi: true
            })
            print(ccn + ';' + srgu + ';' + srguName + ';' + passId + ';' + passName + ';' + stageDays + ';' + stageWorkDays + ';' + upd.nModified + ' / ' + upd.nMatched);
        } else {
            print(ccn + ';Нет совпадений по данной процедуре');
        }
    }
});