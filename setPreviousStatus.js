var cursor = db.claims.find({
    "customClaimNumber": {
        $in: [
"P001-1906060074-32206394",
"P001-6784177769-32805449",
"P001-6784177769-32809467",
"P001-6784177769-32815605",
"P001-2553253938-33254844",
"P001-0050291469-33574600",
"P001-7467866630-33078388",
"P001-0922803700-32832685",
"P001-6849861706-33017252",
"P001-2775438034-33146085",
"P001-0581764074-33166564",
"M503-8875549484-33111766",
"P001-6784177769-32810668",
"P001-6784177769-32816090",
"P001-8096069569-32929035",
"P001-2474501087-33172299",
"P001-9405124757-33596747",
"P001-4076208004-33538413",
"P001-3439857263-32565817",
"P001-9386569146-32940267",
"P001-2775438034-33277948",
"P001-2775438034-33306465",
"P001-1906060074-32191837",
"P001-6784177769-32810465",
"P001-9820905810-33076413",
"P001-6452070782-33569074",
"P001-0307913312-33595987",
"P001-2556551174-32185747",
"P001-9679702783-33061920",
"P001-1906060074-32205574",
"P001-1906060074-32191971",
"P001-1906060074-32191703",
"P001-6784177769-32818991",
"P001-8670342005-33596173",
"P001-2624007443-32483276",
"P001-1097731342-32962837",
"P001-9393794328-33005931",
"P001-2754762156-33051789",
"P001-2775438034-33318602",
"P001-1906060074-32204780",
"P001-1906060074-32203437",
"P001-3824771644-33614174",
"P001-6784177769-32805211",
"P001-6784177769-32815800",
"P001-5165956578-33020078",
"P001-3049768393-33538847",
"P001-3473238012-33585070",
"P001-1533993188-32728483",
"P001-2775438034-33321184",
"P001-1906060074-32207367",
"P001-1906060074-32206969",
"P001-1906060074-32204247",
"P001-6784177769-32805335",
"P001-6784177769-32805869",
"P001-6784177769-32818598",
"P001-6784177769-32818805",
"P001-5165956578-33017789",
"P001-0067423114-33043881",
"P001-7983404858-33515110",
"P001-2756421374-33576698",
"P001-4640212833-32877826",
"P001-9393794328-33006087",
"P001-2775438034-33119901",
"P001-2775438034-33439256",
"P001-3458158898-33499298"
        ]
    }
});

cursor.forEach(function (claim) {
    var origId = claim._id.valueOf();
    var ccn = claim.customClaimNumber;
    
    var statuses = db.claims_status.find({
        "claimId": origId
    }).sort({
        "statusDate": -1
    }).toArray();

    var statusId = statuses[1]._id;

    var StatusDateMS = statuses[1].statusDate.getTime();
    var statusDateNew = new Date(StatusDateMS);

    var createDateMS = statuses[1].createDate.getTime();
    var createDateNew = new Date(createDateMS);


    var statusCodeNew = statuses[1].statusCode;
    var senderCodeNew = statuses[1].senderCode;

    var currStatusNew = {
        "_id": statusId,
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
    var upd = db.claims.update(
        { "customClaimNumber": ccn },
        { $set: { "currStatus" : currStatusNew } },
        { multi: true }
    );
    print("Claim: " + ccn + ", with ID: " + origId + " has been corrected. Progress: " + upd.nModified + ' / ' + upd.nMatched);
});