const fs = require('fs');
const axios = require('axios');

const _ = require('lodash');

const path_clientes = 'emitente.d2';
var path_titulos = 'titulo_11-04.txt';

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
  //console.log(client);
  return parseInt(code) === parseInt(client.code);
};

const inserirUsuarios = async () => {
  let user = {
    user_name: 'ROSE',
    password: '1234'
  };

  try {
    let res = await axiosInstance.post('/api/user', user);
    console.log(res.data);
  } catch (e) {
    console.log(`Não foi possível inserir o usuário ${user.user_name}`);
    console.log(e.response.data.errors);
    return;
  }  

  user = {
    user_name: 'IZAQUE',
    password: '1234'
  };

  try {
    let res = await axiosInstance.post('/api/user', user);
    console.log(res.data);
  } catch (e) {
    console.log(`Não foi possível inserir o usuário ${user.user_name}`);
    console.log(e.response.data.errors);
    return;
  }  
}

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
inserirUsuarios();
inserirRegistros();

