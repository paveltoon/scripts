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
db.claims.find({
    "service.srguServicePassportId": "5000000000215655779"
}).addOption(DBQuery.Option.noTimeout).forEach(function (claim) {
    var id = claim._id;
    var ccn = claim.customClaimNumber;
    var newPermit = [];
    if (claim.fields == undefined || claim.fields.sequenceValue == undefined) {
        print("[WARNING] Fields are undefined. Claim: " + ccn);
        return;
    }

    var sequence = claim.fields.sequenceValue;
    var docData = {
        "docSerial": "",
        "docNumber": ""
    }
    for (var i in sequence) {
        var stringId = sequence[i].stringId;
        if (permitType[stringId] != undefined && sequence[i].value != undefined && sequence[i].value.trim() != "") {
            if (stringId == "docSerial" || stringId == "docNumber") {
                var trimValue = sequence[i].value.split(" ").join("");
                newPermit.push({
                    "type": permitType[stringId],
                    "value": trimValue
                });
                docData[stringId] = trimValue;
            } else {
                newPermit.push({
                    "type": permitType[stringId],
                    "value": sequence[i].value.trim()
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
        "_id": id,
        "customClaimNumber": ccn,
        "then": claim.permitFields != undefined ? claim.permitFields : null,
        "now": newPermit,
        "lastModified": new Date()
    });

    var upd = db.claims.update({
        "_id": id
    }, {
        $set: {
            "permitFields": newPermit
        }
    });

    print("Claim: " + ccn + " updated progress: " + upd.nModified + " / " + upd.nMatched);
})