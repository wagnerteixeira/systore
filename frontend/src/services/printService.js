import jsPDF from 'jspdf';

import {
  getDateToString,
  getNumberDecimalToString,
  getDateToStringYearTwoDigits,
  getCurrentDate,
  getValueWithInterest,
  getNumberToString2
} from '../utils/operators';

let dateCurrent = getCurrentDate();

const createPageForPrintLX300 = (clientData, billReceive) => {
  let _x = 9;
  let items = [];
  //linha 1
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: _x,
    y: 18
  }); //numero_compra
  items.push({ text: clientData.code, x: _x + 32, y: 18 }); //cod_cliente
  items.push({ text: clientData.name, x: _x + 66, y: 18 }); //nome_cliente
  //linha 2
  items.push({ text: billReceive.vendor, x: _x, y: 30 }); //vendedor
  items.push({ text: getDateToStringYearTwoDigits(billReceive.due_date), x: _x + 32, y: 30 }); //data_vencimento
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: _x + 66,
    y: 30
  }); //numero_compra
  items.push({ text: clientData.code, x: _x + 89, y: 30 }); //cod_cliente
  items.push({ text: getDateToString(billReceive.due_date), x: _x + 120, y: 30 }); //data_vencimento
  //linha 3
  items.push({
    text: getNumberDecimalToString(billReceive.original_value),
    x: _x + 36,
    y: 44
  }); //valor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.purchase_date),
    x: _x + 66,
    y: 44
  }); //data_compra
  items.push({ text: billReceive.vendor, x: _x + 89, y: 44 }); //vendedor
  items.push({
    text: getNumberDecimalToString(billReceive.original_value),
    x: _x +125,
    y: 44
  }); //valor
  //linha 4
  let totalValue =
    billReceive.pay_date != null
      ? billReceive.final_value['$numberDecimal']
      : parseFloat(
          getValueWithInterest(
            billReceive.original_value['$numberDecimal'],
            billReceive.due_date,
            dateCurrent
          )
        );
  let interest =
    totalValue - parseFloat(billReceive.original_value['$numberDecimal']);
  if (interest > 0) {
    items.push({
      text: getNumberToString2(interest),
      x: _x + 36,
      y: 56
    }); //juros
    items.push({
      text: getNumberToString2(interest),
      x: _x + 125,
      y: 55
    }); //juros
  }
  //linha 5
  items.push({
    text: getNumberToString2(totalValue),
    x: _x + 36,
    y: 67
  }); //total
  items.push({
    text: getNumberToString2(totalValue),
    x: _x + 125,
    y: 67
  }); //total

  items.push({ text: 'AV. 1º DE JUNHO, 366', x: _x + 67, y: 67 }); //pague_sua_prestacao

  return { width: 1630, height: 300, items: items };
};

const createPageForPrintFX890 = (clientData, billReceive) => {
  let items = [];
  //linha 1
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 8,
    y: 23
  }); //numero_compra
  items.push({ text: clientData.code, x: 40, y: 23 }); //cod_cliente
  items.push({ text: clientData.name, x: 74, y: 23 }); //nome_cliente
  //linha 2
  items.push({ text: billReceive.vendor, x: 8, y: 34 }); //vendedor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.due_date),
    x: 40,
    y: 34
  }); //data_vencimento
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 74,
    y: 34
  }); //numero_compra
  items.push({ text: clientData.code, x: 97, y: 34 }); //cod_cliente
  items.push({ text: getDateToString(billReceive.due_date), x: 128, y: 34 }); //data_vencimento
  //linha 3
  items.push({
    text: getNumberDecimalToString(billReceive.original_value),
    x: 44,
    y: 48
  }); //valor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.purchase_date),
    x: 74,
    y: 46
  }); //data_compra
  items.push({ text: billReceive.vendor, x: 97, y: 45 }); //vendedor
  items.push({
    text: getNumberDecimalToString(billReceive.original_value),
    x: 133,
    y: 47
  }); //valor
  //linha 4
  let totalValue =
    billReceive.pay_date != null
      ? billReceive.final_value['$numberDecimal']
      : parseFloat(
          getValueWithInterest(
            billReceive.original_value['$numberDecimal'],
            billReceive.due_date,
            dateCurrent
          )
        );
  let interest =
    totalValue - parseFloat(billReceive.original_value['$numberDecimal']);
  console.log(interest);
  if (interest > 0) {
    items.push({
      text: getNumberToString2(interest),
      x: 44,
      y: 61
    }); //juros
    items.push({
      text: getNumberToString2(interest),
      x: 133,
      y: 60
    }); //juros
  }
  //linha 5
  let final_value = getNumberDecimalToString(billReceive.final_value);
  if (final_value !== '0,00') {
    items.push({
      text: getNumberToString2(totalValue),
      x: 44,
      y: 72
    }); //total
    items.push({
      text: getNumberToString2(totalValue),
      x: 133,
      y: 72
    }); //total
  }
  items.push({ text: 'AV. 1º DE JUNHO, 366', x: 75, y: 72 }); //pague_sua_prestacao

  return { width: 1630, height: 300, items: items };
};

const printBillsReceiveis = (clientData, billsReceive) => {
  let pages = [];
  billsReceive.forEach(billReceive =>
    pages.push(createPageForPrintLX300(clientData, billReceive))
  );

  let doc = new jsPDF();
  //doc.setFontType("bold");
  doc.deletePage(1);
  doc.setFontSize(12);

  pages.forEach(page => {
    doc.addPage(page.width, page.height);
    page.items.forEach(item => {
      doc.text(item.text + '', item.x, item.y);
    });
  });
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};

export { printBillsReceiveis };
