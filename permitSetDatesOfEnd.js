var permitType = {
    "scenario": "SCENARIO",
    "docType": "DOC_TYPE",
    "docSerial": "DOC_SERIAL",
    "docNumber": "DOC_NUMBER",
    "dateOfBirth": "DATE_OF_BIRTH",
    "vehicleNumber": "VEHICLE_NUMBER",
    "troyka": "TROYKA",
    "strelka": "STRELKA",
    "orgInn": "ORG_INN",
    "orgName": "ORG_NAME",
    "clinicName": "CLINIC_NAME",
    "goal": "GOAL",
    "destination": "DESTINATION",
    "dateBegin": "DATE_BEGIN",
    "dateEnd": "DATE_END",
    "passCode": "CODE",
    "phone": "PHONE"
}

var total = db.claims.find({
    "service.srguServicePassportId": "5000000000215655779",
    "permitFields": {
        $elemMatch: {
            "type": "SCENARIO",
            "value": "1"
        }
    },
    "customClaimNumber": /^MBKT-30.*/i
}).count();

var target = "claims";
var count = 0;
var bulk = db.getCollection(target).initializeUnorderedBulkOp();

db.claims.find({
"service.srguServicePassportId": "5000000000215655779",
"permitFields": {
    $elemMatch: {
        "type": "SCENARIO",
        "value": "1"
    }
},
"customClaimNumber": /^MBKT-30.*/i
}).forEach(function (claim) {
    count++;
    var claimId = claim._id;
    var ccn = claim.customClaimNumber;
    if (claim.fields != undefined && claim.fields.sequenceValue != undefined) {
        var fields = claim.fields;

        for (var i in fields.sequenceValue) {
            if (fields.sequenceValue[i].stringId == "dateEnd") {
                fields.sequenceValue[i].value = "11.05.2020";
                break;
            }
        }

        var newPermit = [];

        var sequence = fields.sequenceValue;
        var docData = {
            "docSerial": "",
            "docNumber": ""
        }
        for (var el in sequence) {
            var stringId = sequence[el].stringId;
            if (permitType[stringId] != undefined && sequence[el].value != undefined && sequence[el].value.trim() != "") {
                if (stringId == "docSerial" || stringId == "docNumber") {
                    var trimValue = sequence[el].value.split(" ").join("");
                    newPermit.push({
                        "type": permitType[stringId],
                        "value": trimValue
                    });
                    docData[stringId] = trimValue;
                } else {
                    newPermit.push({
                        "type": permitType[stringId],
                        "value": sequence[el].value.trim()
                    });
                }
            }
        }
        if (docData.docNumber != undefined) {
            var dul = {
                "type": "DUL",
                "value": ""
            }
            dul["value"] = docData.docSerial != "" ? docData.docSerial + ' ' + docData.docNumber : docData.docNumber;
            newPermit.push(dul);
        }

        db.xxx_permitFields_backup.insert({
            "_id": claimId,
            "customClaimNumber": ccn,
            "then": claim.permitFields != undefined ? claim.permitFields : null,
            "now": newPermit,
            "lastModified": new Date()
        });

        bulk.find({
            "_id": claimId
        }).update({
            $set: {
                "fields": fields,
                "permitFields": newPermit
            }
        });
        var percent = Math.floor(count * 100 / total)
        print("Claim: " + ccn + " ..." + percent + "%");

        if (count % 1000 == 0) {
            bulk.execute();
            bulk = db.getCollection(target).initializeUnorderedBulkOp();
        }
    }
});
if (count > 0) {
    bulk.execute();
}
print(count);