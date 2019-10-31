var cursor = db.claims.find({
    "customClaimNumber": {
        $in: [
            "P001-8169323079-20478063",
            "P001-3485942180-20478847",
            "P001-9364237259-20482772",
            "P001-9364237259-20483522",
            "P001-4713952669-20484094",
            "P001-2501024724-20484380",
            "P001-5932913446-20484400",
            "P001-5932913446-20484603",
            "P001-3321499087-20484666",
            "P001-4684805639-20484829",
            "P001-5932913446-20484870",
            "P001-4422386808-20484873",
            "P001-5932913446-20484875",
            "P001-0062130896-20488498",
            "P001-2788946646-20490172",
            "P001-6479194650-20491184",
            "P001-6479194650-20492380",
            "P001-6479194650-20492799",
            "P001-1474840895-20492896",
            "P001-6479194650-20493226",
            "P001-6479194650-20493711",
            "P001-5885341245-20493799",
            "P001-6479194650-20494403",
            "P001-6221458833-20500159",
            "P001-9800389085-20501576",
            "P001-4335803412-20506156",
            "P001-7363173037-20523896",
            "P001-1144940902-20542088",
            "P001-7371485272-20596928",
            "P001-8984677130-20600923",
            "P001-0031407033-20601050",
            "P001-9412902633-20601224",
            "P001-6284962886-20601252",
            "P001-1885782866-20601888",
            "P001-0863560054-20602044",
            "P001-0863560054-20602077",
            "P001-9412902633-20604872"
        ]
    }
});

cursor.forEach(function (claim) {
    var origId = claim._id.valueOf();
    var statuses = db.claims_status.find({
        "claimId": origId
    }).sort({
        "statusDate": -1
    }).toArray();

    var StatusDateMS = statuses[0].statusDate.getTime();
    var statusDateNew = new Date(StatusDateMS);

    var createDateMS = statuses[0].createDate.getTime();
    var createDateNew = new Date(createDateMS);


    var statusCodeNew = statuses[0].statusCode;
    var senderCodeNew = statuses[0].senderCode;

    var currStatusNew = {
        "_id": new ObjectId(),
        "claimId": origId,
        "statusDate": statusDateNew,
        "statusCode": statusCodeNew,
        "senderCode": senderCodeNew,
        "createDate": createDateNew,
        "lastModified": createDateNew,
        "createBy": "rldd2",
        "lastModifiedBy": "rldd2",
        "createState": "COMPLETED"
    }
    claim.currStatus = currStatusNew;
    db.claims.save(claim);
    print(claim.customClaimNumber + " has been corrected. Id: " + origId);
});