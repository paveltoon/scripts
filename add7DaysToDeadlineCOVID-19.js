function addDaysToDate(date, days) {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return new Date(newDate)
}

db.claims.find({
    "activationDate": {
        $gte: ISODate("2019-07-31T21:00:00.000+0000")
    },
    "resultStatus": {
        $exists: false
    },
    "docSendDate": {
        $exists: false
    },
    "suspenseReason": {
        $exists: true
    },
    $or: [{
        "deadlineInWorkDays": true
    }, {
        "deadlineStages.deadlineInWorkDays": true
    }],
    "suspenseReason.workingDays": true
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origClaimId = claim._id;
    var covid = false;
    if (claim.deadlineStages == undefined) {
        var deadlineStages = [{
            "stageType": "REGULATION_TIME",
            "stageName": "Регламентный срок",
            "deadline": NumberInt(claim.deadline),
            "deadlineInWorkDays": claim.deadlineInWorkDays
        }]
    } else {
        var deadlineStages = claim.deadlineStages;
    }

    for (var i in deadlineStages) {

        if (deadlineStages[i].comment == "COVID-19") {
            print('Already have COVID-19. CCN: ' + ccn);
            covid = true;
            return;
        }
        deadlineStages[i].deadline = NumberInt(deadlineStages[i].deadline)
    }

    if (claim.suspenseReason.createDate > new Date(2020, 02, 28)) {
        print("Claim " + ccn + " has been susspensed after update.");
        return;
    }

    if (covid) {
        return;
    }
 
    var newDeadlineStage = {
        "stageType": "DEADLINE_TRANSFER",
        "stageName": "Корректировка срока",
        "comment": "COVID-19",
        "deadline": NumberInt(7),
        "deadlineInWorkDays": false
    };

    deadlineStages.push(newDeadlineStage)
    var deadDate = new Date(claim.deadlineDate)
    var newDeadlineDate = addDaysToDate(deadDate, 7);
    var newDaysToDeadline = NumberInt(claim.daysToDeadline + 7);


    var deadlineUpdate = db.claims.update({
        "_id": claim._id
    }, {
        $set: {
            "deadlineDate": newDeadlineDate,
            "daysToDeadline": newDaysToDeadline,
            "deadlineStages": deadlineStages
        }
    });

    print("Claim " + ccn + " updated progress: " + deadlineUpdate.nModified + ' / ' + deadlineUpdate.nMatched)
    var mkuObject = {
        "id": null,
        "createDate": new Date(),
        "claimId": origClaimId,
        "statusDate": newDeadlineDate,
        "statusCode": "99",
        "senderCode": "RLDD"
    };

    db.claims_status_mku.save(mkuObject);
});