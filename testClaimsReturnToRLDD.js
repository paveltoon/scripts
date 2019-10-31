var file = cat('C:/MAP/fap.txt');
var ccn = file.split('\n');

//var replace = srgu.replace('_444','');
    var check = 0;
for (var i = 0; i < ccn.length; i++) {

    var claimm = db.claims.find({
        "customClaimNumber": ccn[i]
        }).forEach(function (dno) {

        if (dno.service.srguServiceId != undefined) {
            srgu = dno.service.srguServiceId.split("_444").join('');
            var upd = db.claims.update(
                {"customClaimNumber": ccn[i], "oktmo": "99999999"},
                {$set: {"service.srguServiceId": srgu, "oktmo": "46791000"},
                $unset:{deptId: '', creatorDeptId : ''}},
                {multi : true}
            );
            print(upd.nModified + " / " + upd.nMatched);
            check++;
        }
    });
}
print("Claims updated: " + check)