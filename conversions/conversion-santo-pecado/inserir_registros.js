const fs = require('fs');
const axios = require('axios');

const _ = require('lodash');

const path_clientes = 'emitente.1.txt';
var path_titulos = 'titulo.txt';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
  /* other custom settings */
});

const buscarClientes = async () => {
  const res = await axiosInstance.get('/api/client');
  console.log(res.data);
};

const convertDate = dateString => {
  //Date("2015-03-25")
  //27/05/62
  //27/05/1962
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
  //console.log(client);
  return parseInt(code) === parseInt(client.code);
};

const inserirRegistros = async () => {
  let clients = [];
  let billReceives = [];
  let problems = [];

  let arrayFileClient = fs
    .readFileSync(path_clientes)
    .toString()
    .split('\n');
  for (i in arrayFileClient) {
    let line = arrayFileClient[i].split('|');
    if (line[1].length > 0) {
      console.log(`Inserindo cliente ${line[0]} - ${line[1]}`);
      let client = {
        name: line[1],
        code: line[0],
        registry_date: convertDate(line[2]),
        date_of_birth: convertDate(line[3]),
        address: line[4],
        neighborhood: line[5],
        city: line[6],
        state: line[7],
        postal_code: line[8].replace(/\D/g, ''),
        cpf: line[15],
        seller: line[16],
        job_name: line[17],
        place_of_birth: line[36],
        occupation: line[30],
        spouse: line[18], //conjuge
        note: line[19], //observações
        phone1: '', //telefone 1
        phone2: '' //telefone 2
      };
      try {
        const res = await axiosInstance.post('/api/client', client);
        clients.push(res.data);
      } catch (e) {
        problems.push(
          `Não foi possível inserir o cliente ${line[0]} - ${line[1]}`
        );
        console.log(e.response.data.errors);
      }
    } else {
      problems.push(
        `Não foi possível inserir o cliente ${line[0]} - ${
          line[1]
        } pois o nome está vazio`
      );
    }
    //console.log(res.data);
  }

  /*for(i in clients) { 
    console.log(clients[i]);
  }*/

  let arrayFilebillsReceive = fs
    .readFileSync(path_titulos)
    .toString()
    .split('\n');
  for (i in arrayFilebillsReceive) {
    let line = arrayFilebillsReceive[i].split('|');
    console.log(`Inserindo título ${line[1]} - ${line[2]}`);
    let client = clients.find(findClient(line[0]));
    if (client) {
      let situation = line[15] === 'QUITADO' ? 'C' : 'O';
      let billReceive = {
        client: client._id,
        code: line[1],
        quota: line[2],
        original_value: line[3].replace(',', '.'),
        interest: line[6].replace(',', '.'),
        final_value: line[3].replace(',', '.'),
        purchase_date: convertDate(line[9]),
        due_date: convertDate(line[10]),
        pay_date: convertDate(line[12]),
        days_delay: line[13],
        situation: situation,
        vendor: line[17].toUpperCase()
      };
      //console.log(billReceive);
      try {
        let res = await axiosInstance.post('/api/bills_receive', billReceive);
        //console.log(res.data);
        billReceives.push(res.data);
      } catch (e) {
        problems.push(
          `Não foi possível inserir o título ${line[1]} - ${line[2]}`
        );
        console.log(e.response.data.errors);
        return;
      }
    } else {
      //console.log(`Cliente ${line[0]} não encontrado`);
      problems.push(
        `Cliente ${
          line[0]
        } não encontrado , não foi possível inserir o título ${line[1]} - ${
          line[2]
        }`
      );
    }
    /*for(i in billReceives) { 
      console.log(billReceives[i]);
    }*/
  }

  problems.push(
    `ultimo código de cliente: ${
      arrayFileClient[arrayFileClient.length - 1].split('|')[0]
    }`
  );

  for (i in problems) {
    console.log(problems[i]);
  }

  fs.writeFileSync('ERROS_CONVERSAO.log', problems.join('\n'));
};

/*var d2 = convertDate("04/02/19");
console.log(d2);
var d3 = convertDate('14/08/96');
console.log(d3);
var d4 = convertDate('27/05/62');
console.log(d4);
var d = new Date();
console.log(d);*/
inserirRegistros();
