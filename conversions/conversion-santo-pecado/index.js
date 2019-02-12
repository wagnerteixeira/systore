var fs = require('fs');
var parse = require('csv-parse');
const util = require('util');
const stream = require('stream');


const pipeline = util.promisify(stream.pipeline);

var path_clientes='emitente_teste.txt';
//var path_clientes_alterado = 'emitente_alterado.txt';
var path_titulos='titulo.txt';

var codigoClientePesquisa = 71346;

var retiraEnterLinha = (arquivo, line) => {
  fs.readFile(arquivo, "utf8", function read(err, data) {
    if (err) {
        throw err;
    }
    //console.log(data);    
    var s = data.split('\n');
    var res = [];

    s.forEach((_line, index) => {
      if (index === line - 1) {
        //console.log(_line)
        //console.log(s[line]);
        //console.log(_line + ' ' + s[line]);
        res.push(_line+ ' ' + s[line]); 
      }
      else if (index !== line)         
        res.push(_line);                
      //console.log(`${res.length} ${res[res.length -1].substring(0, 50)}`);
    }); 
    
    /*const writeStream = fs.createWriteStream(clientes_alterado);
    const pathName = writeStream.path;
    res.forEach((l) => writeStream.write(`${l}\n`));
    // the finish event is emitted when all data has been flushed from the stream
    writeStream.on('finish', () => {
      console.log(`wrote all the array data to file ${pathName}`);
    });

    // handle the errors on the write process
    writeStream.on('error', (err) => {
      console.error(`There is an error writing the file ${pathName} => ${err}`)
    });

    // close the stream
    writeStream.end();*/
    fs.writeFileSync('emitente_alterado.txt', res.join("\n"));
    //console.log(res[line -1]);
    //console.log(res[line]);    
    //console.log(res[line + 1]);    
    //console.log(res[4]);
    /*fs.writeFile('emitente_novo.txt', res.map((l) => {
      console.log(l);
      return l;
    }), (err) => {
      console.log(err ? 'Error :'+err : 'ok');
    })*/
    //console.log(s[line]);*/

  });
}

var streamClientes;
var streamTitulo;

var compareName = (a, b) =>
{

  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}

var filter = (item) => {
  return item[1].includes("LEANDRO RICARDO");
}

var filterTitulosComValor = (item) => {
  return parseFloat(item[3]) > 0;
}

filrarTituloPorCliente = (item) => {
  return parseInt(item["0"]) === parseInt(this);

}

var clientes = [];
//var tits = [];

var parser = parse({delimiter: '|'}, function (err, data) {      
  console.log(err);
  if (err){
    var pos = err.message.indexOf("on line");
    var line = parseInt(err.message.substring(pos + 8, err.message.length));
    //console.log(line);
    //var text = fs.readFileSync(clientes,'utf8')
    //console.log(text[140])
    //var res = streamClientes.close();    
    //console.log(res);
    retiraEnterLinha(path_clientes, line);        
    /*async.forEachOf(data, (value, key, callback) => {
      console.log(data[key][0]);
    }, err => {
        if (err) console.error(err.message);    
    });*/
  }
  else {       
    /*data.forEach(item => {
      console.log(`codigo: ${item["0"]} nome: ${item["1"]}`)
    });*/
    clientes = data;
    /*var filtered = data.filter(filter).sort(compareName);
    filtered.forEach(item => {
      console.log(`codigo: ${item["0"]} nome: ${item["1"]} data de cadastro: ${item["2"]} data de nascimento: ${item["3"]} endereço: ${item["4"]} ${item["5"]} ${item["6"]}`)
    });*/
    //executaTitulos();
  }
});


var parserTitulo = parse({delimiter: '|'}, function (err, data) {      
  console.log(err);
  if (err){
    var pos = err.message.indexOf("on line");
    var line = parseInt(err.message.substring(pos + 8, err.message.length));
    //console.log(line);
    //var text = fs.readFileSync(clientes,'utf8')
    //console.log(text[140])
    streamTitulo.close();    
    //retiraEnterLinha(clientes_alterado, line);        
    /*async.forEachOf(data, (value, key, callback) => {
      console.log(data[key][0]);
    }, err => {
        if (err) console.error(err.message);    
    });*/
  }
  else {       
    /*data.forEach(item => {
      console.log(`codigo: ${item["0"]} nome: ${item["1"]}`)
    });*/
    console.log(data.length);
    var filtered = data.filter(filterTitulosComValor);
    console.log(filtered.length);  
    
    clientes.forEach(item => {      
      var tits = data.filter(filrarTituloPorCliente, item[0]);
      if (tits.length > 0) {
        console.log(`codigo: ${item["0"]} nome: ${item["1"]} `);
        tits.forEach(tit => {
          console.log(`-----Título: ${tit["1"]} valor: ${tit["3"]}`)
        })
      }
    })
    
  }
});

var executa = () => {
  streamClientes = fs.createReadStream(path_clientes);
  //console.log(streamClientes);
  streamClientes.pipe(parser); 
}

var executaTitulos = () => {
  console.log(titulos)
  streamTitulo = fs.createReadStream(path_titulos);
  console.log('titulos2')
  //console.log(stream);
  streamTitulo.pipe(parserTitulo); 
}

async function run() {  
  var res = await pipeline(
    fs.createReadStream(path_clientes),
    parser
  );
  console.log(res);
  console.log('Pipeline succeeded');
}

var runAgain = (err) => { 
  if (err.message.indexOf("on line"))
    run().catch((err) => runAgain(err));
}

run().catch((err) => runAgain(err));

//executa();
//executaTitulos();
/*setTimeout(() => executa(), 2000);
setTimeout(() => executa(), 4000);
setTimeout(() => executa(), 6000);
setTimeout(() => executa(), 8000);
setTimeout(() => executa(), 10000);*/