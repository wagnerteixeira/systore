import jsPDF from 'jspdf';

import { getDateToString, getNumberDecimalToString } from '../utils/operators';

const createPageForPrint = (clientData, billReceive) => {
  let items = [];
  //linha 1
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 8,
    y: 18
  }); //numero_compra
  items.push({ text: clientData.id, x: 40, y: 18 }); //cod_cliente
  items.push({ text: clientData.name, x: 74, y: 18 }); //nome_cliente
  //linha 2
  items.push({ text: billReceive.vendor, x: 8, y: 29 }); //vendedor
  items.push({ text: getDateToString(billReceive.dueDate), x: 40, y: 29 }); //data_vencimento
  items.push({
    text: `${billReceive.code}/${billReceive.quota}`,
    x: 74,
    y: 29
  }); //numero_compra
  items.push({ text: clientData.id, x: 97, y: 29 }); //cod_cliente
  items.push({ text: getDateToString(billReceive.dueDate), x: 128, y: 29 }); //data_vencimento
  //linha 3
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: 44,
    y: 43
  }); //valor
  items.push({
    text: getDateToString(billReceive.purchase_date),
    x: 74,
    y: 41
  }); //data_compra
  items.push({ text: billReceive.vendor, x: 97, y: 41 }); //vendedor
  items.push({
    text: getNumberDecimalToString(billReceive.originalValue),
    x: 133,
    y: 42
  }); //valor
  //linha 4
  let interest = getNumberDecimalToString(billReceive.interest);
  if (interest !== '0,00') {
    items.push({
      text: interest,
      x: 44,
      y: 56
    }); //juros
    items.push({
      text: interest,
      x: 133,
      y: 55
    }); //juros
  }
  //linha 5
  let final_value = getNumberDecimalToString(billReceive.final_value);
  if (final_value !== '0,00') {
    items.push({
      text: final_value,
      x: 44,
      y: 67
    }); //total
    items.push({
      text: final_value,
      x: 133,
      y: 67
    }); //total
  }
  items.push({ text: 'SANTO PECADO', x: 75, y: 67 }); //pague_sua_prestacao

  return { width: 1630, height: 300, items: items };
};

const printBillsReceiveis = (clientData, billsReceive) => {
  let pages = [];
  billsReceive.forEach(billReceive =>
    pages.push(createPageForPrint(clientData, billReceive))
  );

  let doc = new jsPDF();
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
