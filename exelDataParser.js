var file = cat('C:/MAP/rldd2.claims.csv');
var right = file.split('\n');

for( var i = 0; i<right.length-1; i++){
  var exelData = right[i].split(';');
  print('Claim: ' + exelData[0] + ', oktmo: ' + exelData[1]);
}
