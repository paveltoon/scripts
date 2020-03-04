function getActualDate(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return (dt + '.' + month + '.' + year + " / " + hour + ':' + minute + ':' + second);
};
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
    "46704000": "mfc-balashiha",
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
    "46725000": "mfc-jykovskiy",
    "46715000": "mfc-dmitrov",
    "46781000": "mfc-chernogolovka",
    "46791000": "mfc-elektrogorsk",
    "46778000": "mfc-taldom"
};

var remoteCon = new Mongo("10.10.80.100:27017");
var cursor = db.claims.find({
    "customClaimNumber": {
        $in: [
            "M503-3542041767-32209585",
            "M503-7681207432-32201079",
            "M503-8988010798-32153296",
            "M503-6591638034-32131213"
        ]
    }
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    if (claim.service != (undefined && null)) {
        var srguId = claim.service.srguServiceId
        var dbName = oktmos[claim.oktmo];
        if (oktmos[claim.oktmo] && remoteCon.getDB(dbName).services.find({
                "serviceIdSrgu": srguId
            })[0]) {
            //Connect DB
            var mfcDB = remoteCon.getDB(dbName);
            var serv = mfcDB.services.find({
                "serviceIdSrgu": srguId
            })[0];

            //add Service Data in new Object
            var servData = {};
            for (var key in claim.service) {
                servData[key] = claim.service[key];
            }
            servData["name"] = serv.fullName;
            var departRef = serv.dept.$id;
            servData["srguDepartmentId"] = mfcDB.departments.find({
                "_id": departRef
            })[0].deptIdSrgu;
            servData["srguDepartmentName"] = mfcDB.departments.find({
                "_id": departRef
            })[0].fullName;
            var passId = serv.servicePassportIdSrgu;
            servData["srguServicePassportId"] = passId;
            var passNameFind = mfcDB.service_passports.find({
                "srguId": passId
            });
            if (passNameFind[0]) {
                servData["srguServicePassportName"] = passNameFind[0].name;
            }
            // Save & Print
            var upd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "service": servData
                }
            }, {
                multi: true
            });
            print(getActualDate(new Date()) + ' Claim: ' + ccn + ' ' + dbName + ' corrected:' + upd.nModified + ' / ' + upd.nMatched)
        } else {
            // If wrong OKTMO, find same claims and paste service
            var wrongOKTMO = db.claims.find({
                "oktmo": claim.oktmo,
                "service.srguServiceId": srguId,
                "service.name": {
                    $exists: true
                },
                "service.srguDepartmentName": {
                    $exists: true
                },
                "activationDate": {
                    $gte: ISODate("2019-08-31T21:00:00.000+0000")
                }
            });
            if (wrongOKTMO[0]) {
                var wrongServData = {}
                for (var wKey in wrongOKTMO[0].service) {
                    wrongServData[wKey] = wrongOKTMO[0].service[wKey];
                }

                // Print & Save
                var updwrong = db.claims.update({
                    "customClaimNumber": ccn
                }, {
                    $set: {
                        "service": wrongServData
                    }
                }, {
                    multi: true
                });
                print(getActualDate(new Date()) + " Claim: " + ccn + ". Finded same claim with oktmo: " + claim.oktmo + ", corrected:" + updwrong.nModified + ' / ' + updwrong.nMatched)
            } else {
                print(getActualDate(new Date()) + " [WARNING] Claim: " + ccn + " has wrong OKTMO: " + claim.oktmo + ", serviceId: " + srguId);
            }
        }
    } else {
        print(getActualDate(new Date()) + " [WARNING] Claim: " + ccn + " have no SERVICE field.")
    }

})