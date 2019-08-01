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
  let _x = 7;
  let items = [];
  //linha 1
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: _x,
    y: 13
  }); //numero_compra
  items.push({ text: clientData.id, x: _x + 32, y: 13 }); //cod_cliente
  items.push({ text: clientData.name, x: _x + 66, y: 13 }); //nome_cliente
  //linha 2
  items.push({ text: billReceive.vendor, x: _x, y: 26 }); //vendedor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.dueDate),
    x: _x + 30,
    y: 27
  }); //data_vencimento
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: _x + 66,
    y: 27
  }); //numero_compra
  items.push({ text: clientData.id, x: _x + 89, y: 26 }); //cod_cliente
  items.push({
    text: getDateToString(billReceive.dueDate),
    x: _x + 120,
    y: 27
  }); //data_vencimento
  //linha 3
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: _x + 36,
    y: 42
  }); //valor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.purchaseDate),
    x: _x + 66,
    y: 42
  }); //data_compra
  items.push({ text: billReceive.vendor, x: _x + 89, y: 42 }); //vendedor
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: _x + 125,
    y: 42
  }); //valor
  //linha 4
  let totalValue =
    billReceive.payDate != null
      ? billReceive.finalValue
      : parseFloat(
          getValueWithInterest(
            billReceive.originalValue,
            billReceive.dueDate,
            dateCurrent
          )
        );
  let interest =
    totalValue - parseFloat(billReceive.originalValue);
  if (interest > 0) {
    items.push({
      text: getNumberToString2(interest),
      x: _x + 36,
      y: 59
    }); //juros
    items.push({
      text: getNumberToString2(interest),
      x: _x + 125,
      y: 59
    }); //juros
    //linha 5
    items.push({
      text: getNumberToString2(totalValue),
      x: _x + 36,
      y: 73
    }); //total
    items.push({
      text: getNumberToString2(totalValue),
      x: _x + 125,
      y: 73
    }); //total
  }

  items.push({ text: 'AV. 1º DE JUNHO, 366', x: _x + 67, y: 73 }); //pague_sua_prestacao

  return { width: 1630, height: 300, items: items };
};

/*
const createPageForPrintFX890 = (clientData, billReceive) => {
  let items = [];
  //linha 1
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 8,
    y: 23
  }); //numero_compra
  items.push({ text: clientData.id, x: 40, y: 23 }); //cod_cliente
  items.push({ text: clientData.name, x: 74, y: 23 }); //nome_cliente
  //linha 2
  items.push({ text: billReceive.vendor, x: 8, y: 34 }); //vendedor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.dueDate),
    x: 40,
    y: 34
  }); //data_vencimento
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 74,
    y: 34
  }); //numero_compra
  items.push({ text: clientData.id, x: 97, y: 34 }); //cod_cliente
  items.push({ text: getDateToString(billReceive.dueDate), x: 128, y: 34 }); //data_vencimento
  //linha 3
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: 44,
    y: 48
  }); //valor
  items.push({
    text: getDateToStringYearTwoDigits(billReceive.purchaseDate),
    x: 74,
    y: 46
  }); //data_compra
  items.push({ text: billReceive.vendor, x: 97, y: 45 }); //vendedor
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: 133,
    y: 47
  }); //valor
  //linha 4
  let totalValue =
    billReceive.payDate != null
      ? billReceive.finalValue
      : parseFloat(
          getValueWithInterest(
            billReceive.originalValue,
            billReceive.dueDate,
            dateCurrent
          )
        );
  let interest =
    totalValue - parseFloat(billReceive.originalValue);
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
  let finalValue = getNumberDecimalToString(billReceive.finalValue);
  if (finalValue !== '0,00') {
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
};*/

const printBillsReceiveis = (clientData, billsReceive) => {
  console.log(clientData);
  console.log(billsReceive);
  let pages = [];
  billsReceive.forEach(billReceive =>
    pages.push(createPageForPrintLX300(clientData, billReceive))
  );

  let doc = new jsPDF();
  //doc.setFontType('bold');
  doc.setFont('Helvetica');
  doc.setFontType('normal');
  doc.deletePage(1);
  doc.setFontSize(12);

  console.log(doc.getFontList());

  pages.forEach(page => {
    doc.addPage(page.width, page.height);
    page.items.forEach(item => {
      doc.text(item.text + '', item.x, item.y);
    });
  });
  doc.autoPrint();
  //window.open(doc.output('bloburl'), '_blank');
  return doc.output('bloburl');
};

export { printBillsReceiveis };
