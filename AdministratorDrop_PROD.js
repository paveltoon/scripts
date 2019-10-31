var remoteConn = new Mongo("10.10.80.100:27017");
var dbs = ["omsu-balashikha", "omsu-bronnitsy", "omsu-chekhovskiy", "omsu-chernogolovka", "omsu-dmitrovskiy", "omsu-dolgoprudnyy", "omsu-domodedovo", "omsu-dubna", "omsu-dzerzhinskiy", "omsu-egoryevskiy", "omsu-elektrogorsk", "omsu-elektrostal", "omsu-fryazino", "omsu-himki", "omsu-istrinskiy", "omsu-ivanteevka", "omsu-kashirskiy", "omsu-klinskiy", "omsu-kolomna", "omsu-korolev", "omsu-kotelniki", "omsu-krasnoarmeysk", "omsu-krasnogorskiy", "omsu-krasnoznamensk", "omsu-leninskiy", "omsu-lobnya", "omsu-losino-petrovskiy", "omsu-lotoshinskiy", "omsu-lukhovitsy", "omsu-lytkarino", "omsu-lyuberetskiy", "omsu-molodezhnyy", "omsu-mozhayskiy", "omsu-mytishchinskiy", "omsu-naro-fominskiy", "omsu-noginskiy", "omsu-odintsovskiy", "omsu-orekhovo-zuevo", "omsu-orekhovo-zuevskiy", "omsu-ozerskiy", "omsu-pavlovo-posadskiy", "omsu-podolsk", "omsu-protvino", "omsu-pushchino", "omsu-pushkinskiy", "omsu-ramenskiy", "omsu-reutov", "omsu-roshal", "omsu-ruzskiy", "omsu-serebryano-prudskiy", "omsu-sergievo-posadskiy", "omsu-serpukhov", "omsu-serpukhovskiy", "omsu-shakhovskiy", "omsu-shaturskiy", "omsu-shchelkovskiy", "omsu-solnechnogorsk", "omsu-stupinskiy", "omsu-taldomskiy", "omsu-vlasikha", "omsu-volokolamskiy", "omsu-voskhod", "omsu-voskresenskiy", "omsu-zarayskiy", "omsu-zhukovskiy", "omsu-zvenigorod", "omsu-zvezdniy", "mfc-balashiha", "mfc-jeleznodorojniy", "mfc-bronnici", "mfc-vlasiha", "mfc-voshod", "mfc-dzerjinskiy", "mfc-dzerjinskiy-zhukova", "mfc-dolgoprudniy", "mfc-domodedovo", "mfc-domodedovo-2", "mfc-domodedovo-avia", "mfc-talalihino", "mfc-dubna-baldina", "mfc-dubna-svobodi", "mfc-egorievsk", "mfc-jykovskiy", "mfc-zvezdniy", "mfc-zvenigorod", "mfc-ivanteevka", "mfc-istra", "mfc-dedovsk", "mfc-kashira", "mfc-kolomna", "mfc-korolev", "mfc-korolev2", "mfc-ubileinyi", "mfc-kotelniki", "mfc-krasnoarmeysk", "mfc-krasnogorsk", "mfc-krasnogorsk-pp", "mfc-krasnogorsk-dachnoe", "mfc-nahabino", "mfc-krasnogorsk-mechnikovo", "mfc-krasnogorsk2", "mfc-krasnoznamensk", "mfc-lobnya", "mfc-lobnya-molodejnaya", "mfc-losino-petrovsk", "mfc-luhovitci", "mfc-lytkarino", "mfc-luberci", "mfc-luberci-oktyabrskiy", "mfc-luberci-gagarina", "mfc-kraskovo", "mfc-malahovka", "mfc-tomilino", "mfc-molodejniy", "mfc-mytishi-karla-marksa", "mfc-ozery", "mfc-orehovo-zyevo", "mfc-pavlovskiy-posad-pokrovskaya", "mfc-pavlovskiy-posad", "mfc-podolsk-kirova", "mfc-podolsk-vysotnaya", "mfc-klimovsk", "mfc-protvino", "mfc-pyshino", "mfc-reytov", "mfc-roshal", "mfc-ryza", "mfc-tuchkovo", "mfc-serebryanie-prudy", "mfc-serpuhovg", "mfc-fryazino", "mfc-fryazino-nahimova", "mfc-himki", "mfc-himki2", "mfc-chernogolovka", "mfc-shatura", "mfc-shahovskoy", "mfc-elektrogorsk", "mfc-elektrostal", "mfc-elektrostal-pobedi", "mfc-volokolamsk", "mfc-voskresensk", "mfc-beloozerskiy", "mfc-dmitrov", "mfc-zaraisk", "mfc-kiln", "mfc-leninskiy", "mfc-lotoshino", "mfc-mojaisk", "mfc-narofominsk", "mfc-aprelevka", "mfc-kalininec", "mfc-noginsk", "mfc-noginsk-kirova", "mfc-noginsk-parkovaya", "mfc-noginsk-2", "mfc-odincovo", "mfc-kubinka", "mfc-nikolskoe", "mfc-kurovskoe", "mfc-likino-dulevo", "mfc-pushkino", "mfc-ramenskoe-vorovskogo", "mfc-ramenskoe", "mfc-sergiev-posad", "mfc-sergiev-posad-2", "mfc-hotkovo", "mfc-serpuhovmr", "mfc-solnechnogorsk", "mfc-stupino", "mfc-taldom", "mfc-chehov", "mfc-lubychanskoe", "mfc-shhelkovo", "mfc-monino", "mfc-kolomenskiymr", "mfc-korolev-sigma", "mfc-luberci-marta", "mfc-dmitrov-2", "mfc-odincovo-lesnoy", "mfc-odincovo-gorka", "mfc-klimovsk-2", "mfc-solnechnogorsk-2", "mfc-odincovo-belarus", "mfc-odincovo-golitsyno", "mfc-losino-petrovsk-biokombinat", "mfc-luberci-oktyabrskiy-2", "mfc-sergiev-posad-park", "mfc-ramenskoe-krymskaya", "mfc-himki-levoberezhnyy", "mfc-himki-skhodnya", "mfc-shodnya", "mfc-zorya"]
for (var i = 0; i < dbs.length; i++) {
  var dbName = dbs[i];



  var db = remoteConn.getDB(dbName);
  var usersAdmin = db.users.find({
      user_custom_role: {
        $elemMatch: {
          "staticUR": "ADMINISTRATOR"
        }
      },
      "login": {
        $nin: ["ppetrov", "support", "umfc", "portal", "portal1", "service", "mfc_u"]
      }
    });

  usersAdmin.forEach(function (s) {
    var permission = s.user_custom_role;
    for (var j = 0; j < permission.length; j++) {
      if (permission[j].staticUR == "ADMINISTRATOR") {
        permission.splice(j, 1);
        db.users.save(s);
      }
    }
  });
}