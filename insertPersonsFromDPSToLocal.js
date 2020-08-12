var local = new Mongo("localhost:27017").getDB("local");

db.persons.find({
  "technicalProperties.type": "GOLD"
}).limit(10000).forEach(person => {
  local.dps.insert(person)
  var commonPersons = person.technicalProperties.references.common;
  // Массив для поиска персон
  var commonPersonsArr = [];

  for (var cp in commonPersons) {
    var persId = commonPersons[cp]
    commonPersonsArr.push(getId(persId))
  }

  // Поиск персон
  var prodPersons = db.persons.find({
    "_id": {
      $in: commonPersonsArr
    }
  }).sort({
    "lastModified": -1
  }).forEach(pers => {
    local.dps.insert(pers)
  })
  
  
})
