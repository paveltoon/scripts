var oktmos = {
    "46628000": "mfc-leninskiy",
    "46711000": "mfc-dzerjinskiy",
    "46734000": "mfc-korolev",
    "46767000": "mfc-protvino",
    "46790000": "mfc-elektrostal",
    "46744000": "mfc-krasnogorsk",
    "46768000": "mfc-ramenskoe",
    "46641000": "mfc-odincovo",
    "46758000": "mfc-pushkino",
    "46728000": "mfc-sergiev-posad",
    "46748000": "mfc-luberci",
    "46750000": "mfc-narofominsk",
    "46762000": "mfc-pyshino",
    "46788000": "mfc-shhelkovo",
    "46605000": "mfc-volokolamsk",
    "46648000": "mfc-ramenskoe",
    "46771000": "mfc-solnechnogorsk",
    "46652000": "mfc-solnechnogorsk",
    "46784000": "mfc-chehov",
    "46756000": "mfc-ozery",
    "46709000": "mfc-domodedovo",
    "46746000": "mfc-mytishi-karla-marksa",
    "46732000": "mfc-ivanteevka",
    "46606000": "mfc-beloozerskiy",
    "46763000": "mfc-voshod",
    "46647000": "mfc-pushkino",
    "46751000": "mfc-noginsk",
    "46738000": "mfc-kolomna",
    "46729000": "mfc-zaraisk",
    "46780000": "mfc-fryazino",
    "46706000": "mfc-krasnoznamensk",
    "46615000": "mfc-sergiev-posad",
    "46733000": "mfc-istra",
    "46659000": "mfc-shhelkovo",
    "46745000": "mfc-mojaisk",
    "46716000": "mfc-dolgoprudniy",
    "46776000": "mfc-stupino",
    "46739000": "mfc-kotelniki",
    "46773000": "mfc-vlasiha",
    "46760000": "mfc-podolsk-kirova",
    "46766000": "mfc-ryza",
    "46708000": "mfc-volokolamsk",
    "46704000": "mfc-balashiha",
    "46622000": "mfc-kolomna",
    "46755000": "mfc-odincovo",
    "46639000": "mfc-noginsk",
    "46612101": "mfc-egorievsk",
    "46752000": "mfc-lotoshino",
    "46628407": "mfc-leninskiy",
    "46786000": "mfc-shatura",
    "46741000": "mfc-lytkarino",
    "46722000": "mfc-egorievsk",
    "46742000": "mfc-losino-petrovsk",
    "46759000": "mfc-pavlovskiy-posad",
    "46764000": "mfc-reytov",
    "46783000": "mfc-shodnya",
    "46737000": "mfc-kiln",
    "46787000": "mfc-shahovskoy",
    "46749000": "mfc-likino-dulevo",
    "46747000": "mfc-luhovitci",
    "46718000": "mfc-dubna-svobodi",
    "46765000": "mfc-roshal",
    "46743000": "mfc-krasnoarmeysk",
    "46770000": "mfc-serpuhovg",
    "46772000": "mfc-serebryanie-prudy",
    "46761000": "mfc-molodejniy",
    "46774000": "mfc-zvezdniy",
    "46740000": "mfc-lobnya",
    "46757000": "mfc-orehovo-zyevo",
    "46705000": "mfc-bronnici",
    "46735000": "mfc-kashira",
    "46730000": "mfc-zvenigorod",
    "46629000": "mfc-lotoshino",
    "46710000": "mfc-voskresensk",
    "46725000": "mfc-jykovskiy",
    "46715000": "mfc-dmitrov",
    "46781000": "mfc-chernogolovka",
    "46791000": "mfc-elektrogorsk",
    "46778000": "mfc-taldom"
};

db.claims.find({
    "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000"),
        $lte: ISODate("2020-01-06T21:00:00.000+0000")
    },
    "deptId": "mfc-jeleznodorojniy"
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var deptId = oktmos[claim.oktmo];
    var origId = claim._id.valueOf();
    var findStatus = db.claims_status.findOne({
        "claimId": origId,
        "deptId": /^mfc.*/i
    });
    if (findStatus != undefined) {
        var dept = findStatus.deptId;
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: {
                "deptId": dept,
                "creatorDeptId": dept
            }
        }, {
            multi: true
        });
        print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
    } else if (deptId != undefined) {
        var upd2 = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: {
                "deptId": deptId,
                "creatorDeptId": deptId
            }
        }, {
            multi: true
        });
        print(ccn + ' ' + upd2.nModified + ' / ' + upd2.nMatched);
    } else {
        print(ccn)
    }
})