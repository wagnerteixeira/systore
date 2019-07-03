const result = require('dotenv').config();
if (result.error) {
  throw result.error;
}

var d = new Date();

var datestring = "_" + d.getDate().toString().padStart(2, '0') + 
                "_" + (d.getMonth()+1).toString().padStart(2, '0') + 
                "_" + d.getFullYear().toString() + 
                "_" + d.getHours().toString().padStart(2, '0') + 
                "_" + d.getMinutes().toString().padStart(2, '0');

const fs = require('fs');
const axios = require('axios');

const _ = require('lodash');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, async function(err, db) {
  if (err) throw err;
  let log_conversao = [];
  let dados_finais = [];
  log_conversao.push('Deletando systore');
  var systore = db.db("systore");
  await systore.dropDatabase();
  log_conversao.push('Deletando systore_log');
  var systore_log = db.db("systore_log");
  await systore_log.dropDatabase();
  log_conversao.push('Inserindo usuários');
  await inserirUsuarios(log_conversao);
  log_conversao.push('Efetuando conversão');
  let lastClientCode = parseInt(await inserirRegistros(log_conversao, dados_finais));
  log_conversao.push(`atualizando ultimo código do cliente para ${lastClientCode}` );
  await db.db("systore").collection("counters").updateOne({_id: "client_code"}, {$set : {seq: lastClientCode}}, {upsert: true});
  /*log_conversao.push('Exportando banco de dados');  
  try{
    var result = await exec('rm -rf dump && mongodump --db systore');
  }
  catch(e){
    log_conversao.push(e);
  }

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);

  log_conversao.push('Movendo banco de dados no servidor');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS
    } "mv -f dump dump${datestring}"`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);

  log_conversao.push('Copiando banco de dados para o servidor');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} scp -o StrictHostKeyChecking=no -r dump ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS}:/root`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);


  log_conversao.push('Deletando banco de dados de log');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS
    } "mongo systore_log --eval 'db.dropDatabase()'"`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);


  log_conversao.push('Restaurando banco de dados systore');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS
    } "cd /root && mongorestore --nsInclude systore.clients --nsInclude systore.users --nsInclude systore.billsreceives --drop"`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);

  log_conversao.push(...dados_finais);

  log_conversao.push('Quantidade de clientes no servidor');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS
    } "mongo systore --eval 'db.clients.count()'"`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);

  log_conversao.push('Quantidade de parcelas no servidor');
  result = await exec(
    `sshpass -p ${process.env.SSH_PASS} ssh -o StrictHostKeyChecking=no ${
      process.env.SSH_USER
    }@${
      process.env.SSH_ADDRESS
    } "mongo systore --eval 'db.billsreceives.count()'"`
  );

  if (result.stderr) {
    log_conversao.push(`error: ${result.stderr}`);
  }
  log_conversao.push(result.stdout);
  */

  fs.writeFileSync('CONVERSAO.log', log_conversao.join('\n'));

  for (i in log_conversao) {
    console.log(log_conversao[i]);
  }
  
});

const path_clientes = 'emitente_d_0706_convert';
var path_titulos = 'titulo_07_06';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
  /* other custom settings */
});

const buscarClientes = async () => {
  const res = await axiosInstance.get('/api/client');
  log_conversao.push(res.data);
};

const convertDate = dateString => {
  //Date("2015-03-25")
  //27/05/62
  //27/05/1962
  if (dateString === "?")
    return null;
  try {
    let dateArray = dateString.split('/');
    let year = dateArray[2];
    if (year.length === 2) {
      if (parseInt(year) < 50) year = '20' + year;
    }
    return new Date(year, parseInt(dateArray[1]) - 1, dateArray[0]);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const findClient = code => client => {
  //log_conversao.push(client);
  return parseInt(code) === parseInt(client.code);
};

const inserirUsuarios = async (log_conversao) => {  
  let user = {
    user_name: 'ROSE',
    password: '1234'
  };

  try {
    let res = await axiosInstance.post('/api/user', user);
    log_conversao.push('Inserido o usuário ROSE')
    console.log(res.data);
  } catch (e) {
    log_conversao.push(`Não foi possível inserir o usuário ${user.user_name}`);
    log_conversao.push(e.response.data.errors);
    return;
  }  

  user = {
    user_name: 'IZAQUE',
    password: '1234'
  };

  try {
    let res = await axiosInstance.post('/api/user', user);
    log_conversao.push('Inserido o usuário IZAQUE')
    console.log(res.data);
  } catch (e) {
    log_conversao.push(`Não foi possível inserir o usuário ${user.user_name}`);
    log_conversao.push(e.response.data.errors);
    return;
  }  
}

const inserirRegistros = async (log_conversao, dados_finais) => {  
  let clients = [];
  let billReceives = []; 
  let clients_insert = 0;
  let bill_receives_insert = 0;


  let arrayFileClient = fs
    .readFileSync(path_clientes)
    .toString()
    .split('\n');
  dados_finais.push(`Arquivo de cliente existem ${arrayFileClient.length} linhas`);
  for (i in arrayFileClient) {
    let line = arrayFileClient[i].split('|');
    if (line[1].length > 0) {   
      let civil_status = 0;
      //1-SOLTEIRO(A) 2-CASADO(A) 3-DIVORCIADO(A) 4-SEPARADO(A) 5-VIÚVO(A)
      switch (line[71]) { //ok
        case '':
          civil_status = 0;
          break;
        case 'SOLTEIRO(A)':
            civil_status = 1;
            break;
        case 'CASADO(A)':
            civil_status = 2;
            break;
        case 'DIVORCIADO(A)':
            civil_status = 3;
            break;
        case 'SEPARADO(A)':
            civil_status = 4;
            break;
        case 'VI�VO(A)':
            civil_status = 5;
            break;
        default:
            civil_status = 0;
      }     

      console.log(`Inserindo cliente ${line[0]} - ${line[1]}`);    
      let client = {
        name: line[1], //ok
        code: line[0], //ok
        registry_date: convertDate(line[2]), //ok
        date_of_birth: convertDate(line[3]), //ok
        address: line[4], //ok
        neighborhood: line[5], //ok
        city: line[6], //ok
        state: line[7], //ok
        postal_code: line[8].replace(/\D/g, ''), //ok
        cpf: line[15], //ok
        seller: line[16], //ok
        job_name: line[17], //ok
        place_of_birth: line[50], //conferir ok
        occupation: line[44], //ok
        spouse: line[18], //conjuge //ok
        note: line[31], //observações conferir
        phone1: line[19], //telefone 1
        phone2: line[20], //telefone 2
        address_number: line[116], //Número do endereço ok
        rg: line[14], // rg
        complement: line[117], // complemento ok
        admission_date: convertDate(line[51]), //Data de admissao
        civil_status: civil_status, //estado civil,
        father_name: line[32], // Nome do pai //ok
        mother_name: line[33], // Nome da mae //ok
      };
      try {
        const res = await axiosInstance.post('/api/client', client);
        clients.push(res.data);
        clients_insert++;
      } catch (e) {
        log_conversao.push(
          `Não foi possível inserir o cliente ${line[0]} - ${line[1]} ${e.response.data.errors}`
        );
        return;
      }
    } else {
      log_conversao.push(
        `Não foi possível inserir o cliente ${line[0]} - ${
          line[1]
        } pois o nome está vazio`
      );
    }
    //log_conversao.push(res.data);
  }
  
  /*for(i in clients) { 
    log_conversao.push(clients[i]);
  }*/

  let arrayFilebillsReceive = fs
    .readFileSync(path_titulos)
    .toString()
    .split('\n');
  dados_finais.push(`Arquivo de título existem ${arrayFilebillsReceive.length} linhas`);
  for (i in arrayFilebillsReceive) {
    let line = arrayFilebillsReceive[i].split('|');
    console.log(`Inserindo título ${line[1]} - ${line[2]}`);
    let client = clients.find(findClient(line[0]));
    if (client) {
      let final_value =
        parseFloat(line[3].replace(',', '.')) +
        parseFloat(line[6].replace(',', '.'));
      let situation = line[15] === 'QUITADO' ? 'C' : 'O';
      let billReceive = {
        client: client._id,
        code: line[1],
        quota: line[2],
        original_value: line[3].replace(',', '.'),
        interest: line[6].replace(',', '.'),
        final_value: final_value,
        purchase_date: convertDate(line[9]),
        due_date: convertDate(line[10]),
        pay_date: convertDate(line[12]),
        days_delay: line[13],
        situation: situation,
        vendor: line[17].toUpperCase()
      };
      //log_conversao.push(billReceive);
      try {
        let res = await axiosInstance.post('/api/bills_receive', billReceive);
        //log_conversao.push(res.data);
        billReceives.push(res.data);
        bill_receives_insert++;
      } catch (e) {
        log_conversao.push(
          `Não foi possível inserir o título ${line[1]} - ${line[2]} ${e.response.data.errors}`
        );        
        return;
      }
    } else {
      //log_conversao.push(`Cliente ${line[0]} não encontrado`);
      log_conversao.push(
        `Cliente ${
          line[0]
        } não encontrado , não foi possível inserir o título ${line[1]} - ${
          line[2]
        } de valor: ${line[3]}, situação: ${line[15]}, data da compra: ${line[9]}, data de vencimento: ${line[10]}, data de pagamento: ${line[12]}` 
      );
    }
    /*for(i in billReceives) { 
      log_conversao.push(billReceives[i]);
    }*/
  }  

  log_conversao.push(
    `ultimo código de cliente: ${
      arrayFileClient[arrayFileClient.length - 1].split('|')[0]
    }`
  );  
  dados_finais.push(`Foram inseridos ${clients_insert} clientes`);
  dados_finais.push(`Foram inseridos ${bill_receives_insert} parcelas`);
  return arrayFileClient[arrayFileClient.length - 1].split('|')[0];
};

/*var d2 = convertDate("04/02/19");
log_conversao.push(d2);
var d3 = convertDate('14/08/96');
log_conversao.push(d3);
var d4 = convertDate('27/05/62');
log_conversao.push(d4);
var d = new Date();
log_conversao.push(d);*/
