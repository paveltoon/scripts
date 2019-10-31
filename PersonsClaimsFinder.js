var personId = ["58906b42a78ee090bd9342db",
"5889e8c7a78e86e6915d2cc3",
"568ffff6a78e08d778cd2fcd",
"5760248ba78e5fa263747861"];
for (var i = 0; i < personId.length; i++){
var person = db.claims.find({ "personsInfo.0._id": ObjectId(personId[i]) });

person.forEach(function(num) {
print(num.customClaimNumber + "; " + num.claimCreate + "; " + num.currStatus.statusCode + "; " + num.service.srguDepartmentName);
});
}