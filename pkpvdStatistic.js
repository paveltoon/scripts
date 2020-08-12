function getActualDate(date){
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();
 
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
 
	return(dt + '.' + month + '.' + year);
};

var step = 0;

db.rs_appeal.find({
  "moveStepEvent.dateWhen": {
    $gte: ISODate("2020-06-01T00:00:00.000+0300"),
    $lte: ISODate("2020-06-30T00:00:00.000+0300")
  },
  "moveStepEvent.performer.orgCode": /^MFC.*/i,
  "currentStep": "PROCESS_END_13"
}).forEach((doc) => {
  if (step <= 0) {
    print(`Дата выдачи;Код мфц;Наименование мфц;Фио выдавшего;Номер обращения;Номера заявлений;Количество заявлений;Наименование услуги`);
    step++;
  }
  var dateWhen = getActualDate(doc.moveStepEvent.dateWhen);
  var orgCode = doc.moveStepEvent.performer.orgCode;
  var orgName = doc.moveStepEvent.performer.orgName;
  if (orgName.indexOf("\n")) {
    orgName = orgName.replace("\n", "")
  }
  if (orgName.indexOf("\r")) {
    orgName = orgName.replace("\r", "")
  }
  var surName = doc.moveStepEvent.performer.surName;
  var firstName = doc.moveStepEvent.performer.firstName;
  var patronymic = doc.moveStepEvent.performer.patronymic;
  var internalNum = doc.internalNum;
  var statements = doc.statements;
  var name = doc.name;
  var stateInternalNum = [];
  var countOfIntNum = 0;

  for(var s in statements) {
    var state = statements[s];
    if (state.internalNum != undefined) {
      stateInternalNum.push(state.internalNum)
      countOfIntNum++;
    }
  }
  print(`${dateWhen};${orgCode};${orgName};${surName} ${firstName} ${patronymic};${internalNum};${stateInternalNum};${countOfIntNum};${name}`)
});