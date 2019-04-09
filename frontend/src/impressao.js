var doc = new jsPDF();
doc.deletePage(1);
doc.addPage(1630, 300);
doc.setFontSize(12);

var items = [];
//linha 1
items.push({text: "123456/1", x: 8, y:18 }); //numero_compra
items.push({text: "654321", x: 40, y:18 }) //cod_cliente
items.push({text: "MARIA DA GLORIA NASCIMENTO", x: 74, y:18 }) //nome_cliente
//linha 2
items.push({text: "VENDEDOR", x: 8, y:29 }) //vendedor
items.push({text: "10/04/2019", x: 40, y:29 }) //data_vencimento
items.push({text: "123456/1", x: 74, y:29 })//numero_compra
items.push({text: "654321", x: 97, y:29 })//cod_cliente
items.push({text: "10/04/2019", x: 128, y:29 })//data_vencimento
//linha 3
items.push({text: "66,35", x: 44, y:43 })//valor
items.push({text: "10/01/2019", x: 74, y:41 })//data_compra
items.push({text: "VENDEDOR", x: 97, y:41 })//vendedor
items.push({text: "66,35", x: 133, y:42 })//valor
//linha 4
items.push({text: "0,00", x: 44, y:56 })//juros
items.push({text: "0,00", x: 133, y:55 })//juros
//linha 5
items.push({text: "66,35", x: 44, y:67 })//total
items.push({text: "SANTO PECADO", x: 75, y:67 })//pague_sua_prestacao
items.push({text: "66,35", x: 133, y:67 })//total

items.forEach(item => {
    doc.text(item.text, item.x, item.y);
});


doc.addPage(1630, 300);
items.forEach(item => {
    doc.text(item.text, item.x, item.y);
});

doc.addPage(1630, 300);
items.forEach(item => {
    doc.text(item.text, item.x, item.y);
});

doc.autoPrint();