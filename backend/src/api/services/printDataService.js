let printDataServiceLx300 = {};
let printDataServiceFX890 = {};

printDataServiceFX890.Linha1NumeroCompra = { x: 8, y: 18 }; //numero_compra
printDataServiceFX890.Linha1CodCliente = { x: 40, y: 23 }; //cod_cliente
printDataServiceFX890.Linha1NomeCliente = { x: 74, y: 23 }; //Nome_cliente
printDataServiceFX890.Linha2Vendedor = { x: 8, y: 34 }; //vendedor
printDataServiceFX890.Linha2DataVencimento = { x: 40, y: 34 }; //data_vencimento
printDataServiceFX890.Linha2NumeroCompra = { x: 74, y: 34 }; //numero_compra
printDataServiceFX890.Linha2CodCliente = { x: 97, y: 34 }; //Cod_cliente
printDataServiceFX890.Linha2DataVencimento2 = { x: 128, y: 34 }; //data_vencimento
printDataServiceFX890.Linha3Valor = { x: 44, y: 48 }; //valor
printDataServiceFX890.Linha3DataCompra = { x: 74, y: 46 }; //data_compra
printDataServiceFX890.Linha3Vendedor = { x: 97, y: 45 }; //vendedor
printDataServiceFX890.Linha3Valor2 = { x: 133, y: 47 }; //valor
printDataServiceFX890.Linha4Juros = { x: 44, y: 61 }; //juros
printDataServiceFX890.Linha4Juros2 = { x: 133, y: 60 }; //juros
printDataServiceFX890.Linha5Total = { x: 44, y: 72 }; //total
printDataServiceFX890.Linha5PagueSuaPrestacao = { x: 75, y: 72 }; //pague_prestaca
printDataServiceFX890.Linha5Total2 = { x: 133, y: 72 }; //total

printDataServiceLx300.Linha1NumeroCompra = { x: 8, y: 18 }; //numero_compra
printDataServiceLx300.Linha1CodCliente = { x: 40, y: 18 }; //cod_cliente
printDataServiceLx300.Linha1NomeCliente = { x: 74, y: 18 }; //Nome_cliente
printDataServiceLx300.Linha2Vendedor = { x: 8, y: 29 }; //vendedor
printDataServiceLx300.Linha2DataVencimento = { x: 40, y: 29 }; //data_vencimento
printDataServiceLx300.Linha2NumeroCompra = { x: 74, y: 29 }; //numero_compra
printDataServiceLx300.Linha2CodCliente = { x: 97, y: 29 }; //Cod_cliente
printDataServiceLx300.Linha2DataVencimento2 = { x: 128, y: 29 }; //data_vencimento
printDataServiceLx300.Linha3Valor = { x: 44, y: 43 }; //valor
printDataServiceLx300.Linha3DataCompra = { x: 74, y: 41 }; //data_compra
printDataServiceLx300.Linha3Vendedor = { x: 97, y: 41 }; //vendedor
printDataServiceLx300.Linha3Valor2 = { x: 133, y: 42 }; //valor
printDataServiceLx300.Linha4Juros = { x: 44, y: 56 }; //juros
printDataServiceLx300.Linha4Juros2 = { x: 133, y: 55 }; //juros
printDataServiceLx300.Linha5Total = { x: 44, y: 67 }; //total
printDataServiceLx300.Linha5PagueSuaPrestacao = { x: 75, y: 67 }; //pague_prestaca
printDataServiceLx300.Linha5Total2 = { x: 133, y: 67 }; //total

const setPrintData = (req, res, next) => {
  let printDataService = null;
  if (req.query.impressora && req.query.impressora === 'lx300')
    printDataService = printDataServiceLx300;
  else printDataService = printDataServiceFX890;

  printDataService.Linha1NumeroCompra = req.body['Linha1NumeroCompra'];
  printDataService.Linha1CodCliente = req.body['Linha1CodCliente'];
  printDataService.Linha1NomeCliente = req.body['Linha1NomeCliente'];
  printDataService.Linha2Vendedor = req.body['Linha2Vendedor'];
  printDataService.Linha2DataVencimento = req.body['Linha2DataVencimento'];
  printDataService.Linha2NumeroCompra = req.body['Linha2NumeroCompra'];
  printDataService.Linha2CodCliente = req.body['Linha2CodCliente'];
  printDataService.Linha2DataVencimento2 = req.body['Linha2DataVencimento2'];
  printDataService.Linha3Valor = req.body['Linha3Valor'];
  printDataService.Linha3DataCompra = req.body['Linha3DataCompra'];
  printDataService.Linha3Vendedor = req.body['Linha3Vendedor'];
  printDataService.Linha3Valor2 = req.body['Linha3Valor2'];
  printDataService.Linha4Juros = req.body['Linha4Juros'];
  printDataService.Linha4Juros2 = req.body['Linha4Juros2'];
  printDataService.Linha5Total = req.body['Linha5Total'];
  printDataService.Linha5PagueSuaPrestacao =
    req.body['Linha5PagueSuaPrestacao'];
  printDataService.Linha5Total2 = req.body['Linha5Total2'];
  return res.status(200).send(printDataService);
};

const getPrintData = (req, res, next) => {
  if (req.query.impressora && req.query.impressora === 'lx300')
    return res.status(200).send(printDataServiceLx300);
  else return res.status(200).send(printDataServiceFX890);
};

module.exports = { setPrintData, getPrintData };
