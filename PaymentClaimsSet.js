var upd = db.claims.update({
    "service.srguServiceId": "5000000000187042508",
    "service.paymentInfo": {
        $not: {
            $exists: true
        }
    },
    "claimCreate": {
        $gte: ISODate("2019-01-01T00:00:00.000+0000")
    }
}, {
    $set: {
        "service.paymentInfo": {
            "paymentType": "OPTIONAL",
            "sendAttachWithResultStatus": true,
            "additionalPaymentRequired": false
        }
    }
}, {
    multi: true
});

print(upd.nModified + " / " + upd.nMatched)