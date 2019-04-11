var fs = require('fs');


//var path_clientes='titulo_11-04.txt';
var path_clientes = 'emitente_11-04.txt';
var path_titulos='titulo_teste.txt';

var countFields = 0;


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
      return false;
    }    
  }
  console.log('Arquivo OK');
  return true;
}
processarArquivo(path_clientes);
//processarArquivo(path_titulos);
