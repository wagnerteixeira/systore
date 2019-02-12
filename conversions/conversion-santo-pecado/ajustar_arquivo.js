var fs = require('fs');


var path_clientes='emitente_teste.1.txt';
//var path_clientes_alterado = 'emitente_alterado.txt';
var path_titulos='titulo_teste.txt';

var countFields = 0;
var linhasRetiradas = 0;

var retiraEnterLinha = async (arquivo, line) => {
  var lineIndex = parseInt(line);
  var arrayFile = fs.readFileSync(arquivo).toString().split("\n");  
  var res = [];

  for(i in arrayFile) { 
    var index = parseInt(i);

    if (arrayFile[lineIndex].length === 0)
      return;

    if (index === lineIndex) {
      //console.log('montagem da linha');
      //console.log(arrayFile[index] + ' ' + arrayFile[index + 1]);
      res.push(arrayFile[index] + ' ' + arrayFile[index + 1]); 
    }
    else if (index === lineIndex + 1){

    }
    else       
      res.push(arrayFile[index]);                
  }
  console.log(res.join("\n"));
  fs.writeFileSync(arquivo, res.join("\n"));
  forceGC();      
}

var processarArquivo = (arquivo) => {
  var array = fs.readFileSync(arquivo).toString().split("\n");

  for(i in array) {        
    var fields = array[i].split('|');  
    if (countFields === 0) {
      countFields = fields.length;  
      console.log(`Quantidade de campos: ${countFields}`);
    }
    if (countFields !== fields.length){
      console.log('retirar enter linha ' + i);    
      retiraEnterLinha(arquivo, i);
      processarArquivo(arquivo);
      return false;
    }    
  }
  console.log('Arquivo OK');
  return true;
}

var forceGC = () => {
   if (global.gc) {
      global.gc();
   } else {
      console.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
   }
}

processarArquivo(path_clientes);
//processarArquivo(path_titulos);
