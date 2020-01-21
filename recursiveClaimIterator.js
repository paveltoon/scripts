function recursive(obj, objName) {
    for (var i in obj) {
        if (obj[i] instanceof Object && !(obj[i] instanceof ObjectId) && !(obj[i] instanceof Array) && !(obj[i] instanceof Date) && i != 'fields') {
            recursive(obj[i], i);
        } else {
            if(objName == undefined){
                print(i + ': ' + obj[i])
            } else {
                print(objName + '.' + i + ': ' + obj[i]);
            }   
        }
    }
}
var cursor = db.xxx_rpgu_claims_to_restore.find({}).limit(1).forEach(function (claim) {
    var origId = claim.production;
    var source = claim.claim[0];
    var target = db.claims.findOne({
        "_id": origId
    });
    /* for(var key in source){
        if(!target.hasOwnProperty(key) && key != 'fields' && key != 'deadlineStages' && key != 'pguConsultationInfo' ){
            print(key)
        }
    }  */
    recursive(source)
})