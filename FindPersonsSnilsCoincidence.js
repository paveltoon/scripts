// Расхождение данных
var incorrect = 0;

// Нет совпадений при поиске отформатированной заявки
var notFound = 0;

// Совпадения снилс
var snilsCount = 0;

// Совпадения снилс и фио
var fioSnilsCount = 0;

// Поиск снилс, в которых содератся символы "-", " "
var cursor = db.persons.find({
    $or: [{
        "snils": /.* .*/i
    }, {
        "snils": /.*-.*/i
    }]
});

cursor.forEach(function (pers) {

    // Создание неформатированного СНИЛС
    var actualSnils = pers.snils.trim();
    var prettySnils = actualSnils.split(' ').join('');
    var veryPrettySnils = prettySnils.split('-').join('');


    if (pers.surname == undefined || pers.firstName == undefined) {
        print('Некорректная персона: ' + pers._id.valueOf());
        return;
    }

    // Данные персоны
    var fioFirst = pers.surname.toUpperCase().trim() + ' ' + pers.firstName.toUpperCase().trim();
    var personId = pers._id.valueOf();

    // Поиск по неформатированному снилсу
    var findSnils = db.persons.findOne({
        "snils": veryPrettySnils
    });

    // Найден указанный снилс и в заявке есть поля 'Фамилия', 'Имя'.
    if (findSnils && findSnils.surname && findSnils.firstName) {
        var fioSecond = findSnils.surname.toUpperCase().trim() + ' ' + findSnils.firstName.toUpperCase().trim();
        //Совпадение по СНИЛС И ФИО
        if (fioFirst == fioSecond) {
            fioSnilsCount++;
        } else {
            //Совпадение только по СНИЛС
            print('Одинаковый снилс, разные ФИО: ' + personId + ' ' + findSnils._id);
            snilsCount++;
        }

    } else if (!findSnils) {
        // Не найден неформатированный снилс
        notFound++;
        return;
    } else {
        print('Расхождение данных: ' + findSnils._id + ' ' + personId);
        incorrect++;
    }

});
print('Совпадений по "СНИЛС" и "ФИО": ' + fioSnilsCount + '\n' + 'Совпадений по "СНИЛС": ' + snilsCount + '\n' + 'Не найдено совпадений: ' + notFound + '\n' + 'Расхождение данных: ' + incorrect + '\n' + 'Итого: ' + (fioSnilsCount + snilsCount + notFound + incorrect));