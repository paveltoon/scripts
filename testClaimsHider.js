var file = cat('C:/MAP/map.txt');
var ccn = file.split('\n');

//var replace = srgu.replace('_444','');

for (var i = 0; i < ccn.length; i++) {
  
  var check = 0;
  
  var claimm = db.claims.find( {"customClaimNumber" : ccn[i]} ).forEach(function(dno) {
  
      if (dno.service.srguServiceId != undefined){
        srgu = dno.service.srguServiceId;
    
    var upd = db.claims.update(
    {
      "customClaimNumber" : ccn[i] 
    },
    {
      $set: {
         
        "service.srguServiceId" : srgu + "_444",
		"deptId": "mfc",
		"oktmo": "99999999", 
		"creatorDeptId": "mfc"
       }
    },
    {
     multi:true
    }
    
  );
  
 /* if (upd.nModified == 0){
    print (ccn[i]);
  }*/
  
     }
   else print ("No SRGU for claim  " + ccn[i]);
    
   check++;
   });
  
  if (check == 0){
    print ("Claim Not Found in RLDD  " + ccn[i]);
  }
}