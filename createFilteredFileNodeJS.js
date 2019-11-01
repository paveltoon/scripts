var fs = require('fs')

var textByLine = fs.readFileSync('All.txt').toString().split("\n");

textByLine.forEach(function(tex){
    if (!tex.includes('_444')){
        fs.appendFile('array.txt', tex, (err) => { 
            // In case of a error throw err. 
            if (err) throw err; 
        });
    }
});

/* Запись файла :

fs.writeFile('array.txt', result, (err) => { 
      
    // In case of a error throw err. 
    if (err) throw err; 
}) 

*/ 