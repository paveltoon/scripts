var oktmos = [
"46704000",
"46705000",
"46773000",
"46605000",
"46606000",
"46711000",
"46715000",
"46716000",
"46709000",
"46718000",
"46722000",
"46725000",
"46729000",
"46763000",
"46774000",
"46730000",
"46732000",
"46733000",
"46735000",
"46736000",
"46737000",
"46738000",
"46738000",
"46734000",
"46739000",
"46743000",
"46744000",
"46706000",
"46628000",
"46740000",
"46742000",
"46629000",
"46747000",
"46741000",
"46748000",
"46745000",
"46761000",
"46746000",
"46750000",
"46751000",
"46641000",
"46756000",
"46757000",
"46749000",
"46759000",
"46760000",
"46760000",
"46767000",
"46647000",
"46762000",
"46648000",
"46764000",
"46765000",
"46766000",
"46615000",
"46772000",
"46770000",
"46651000",
"46652000",
"46776000",
"46778000",
"46780000",
"46783000",
"46781000",
"46784000",
"46786000",
"46787000",
"46659000",
"46791000",
"46790000"
];

var dept = [
"Администрация городского округа Балашиха",
"Администрация городского округа Бронницы",
"Администрация городского округа Власиха",
"Администрация Волоколамского района",
"Администрация Воскресенского района",
"Администрация городского округа Дзержинский",
"Администрация Дмитровского района",
"Администрация города Долгопрудный",
"Администрация городского округа Домодедово",
"Администрация города Дубны",
"Администрация городского округа Егорьевск",
"Администрация городского округа Жуковский",
"Администрация городского округа Зарайск",
"Администрация городского округа ЗАТО Восход",
"Администрация городского округа Звездный городок",
"администрация городского округа Звенигород",
"Администрация города Ивантеевка",
"Администрация городского округа Истра",
"Администрация Каширского района",
"Администрация города Климовск",
"Администрация Клинского района",
"Администрация городского округа Коломна",
"Администрация города Коломна",
"Администрация городского округа Королев",
"Администрация городского округа Котельники",
"Администрация городского округа Красноармейск",
"Администрация городского округа Красногорск",
"Администрация городского округа Краснознаменск",
"Администрация Ленинского муниципального района",
"Администрация городского округа Лобня",
"Администрация городского округа Лосино-Петровский",
"Администрация Лотошинского муниципального округа",
"Администрация городского округа Луховицы",
"Администрация городского округа Лыткарино",
"Администрация городского округа Люберцы",
"Администрация Можайского муниципального района",
"Администрация городского округа Молодёжный",
"Администрация городского округа Мытищи",
"Администрация городского округа Наро-Фоминск",
"Администрация Ногинского муниципального района (Богородский)",
"Администрация Одинцовского района",
"Администрация городского округа Озеры",
"Администрация городского округа Орехово-Зуево",
"Администрация городского округа Ликино-Дулево",
"Администрация городского округа Павловский Посад",
"Администрация Подольского городского округа",
"Администрация Подольского муниципального района",
"Администрация городского округа Протвино",
"Администрация Пушкинского района",
"Администрация города Пущино",
"Администрация Раменского района",
"Администрация городского округа Реутов",
"Администрация городского округа Рошаль",
"Администрация городского округа Руза",
"Администрация Сергиево-Посадского района",
"Администрация городского округа Серебряные Пруды",
"Администрация городского округа Серпухов",
"Администрация Серпуховского муниципального района",
"Администрация Солнечногорского муниципального района",
"Администрация городского округа Ступино",
"Администрация Талдомского муниципального района",
"Администрация городского округа Фрязино",
"Администрация городского округа Химки",
"Администрация городского округа Черноголовка",
"Администрация городского округа Чехов",
"Администрация городского округа Шатура",
"Администрация городского округа Шаховская",
"Администрация Щелковского муниципального района",
"Администрация городского округа Электрогорск",
"Администрация городского округа Электросталь"
];

var j = 0;

for (var i = 0; i < oktmos.length; i++) {
    var cursor = db.claims.find({ 
        "service.srguServiceId": "5000000000178113247", 
        "claimCreate": { $gte: ISODate("2018-12-31T21:00:00.000+0000"), 
         $lte: ISODate("2019-03-31T21:00:00.000+0000") },
         "oktmo": oktmos[i] }).count();
    var result = db.claims.find({ 
        "service.srguServiceId": "5000000000178113247", 
        "docSendDate": { $gte: ISODate("2018-12-31T21:00:00.000+0000"), 
         $lte: ISODate("2019-03-31T21:00:00.000+0000") },
         "oktmo": oktmos[i],
         "resultStatus": "3" }).count();
         print(dept[j] + ";" + cursor + ";" + result);
          j++;
        
}