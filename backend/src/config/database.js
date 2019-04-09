const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : 'mongodb://localhost/systore';

module.exports = mongoose
  .connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    mongoose.connection.db
      .listCollections()
      .toArray(function(err, collections) {
        if (err) {
          console.log(err);
          return;
        }
        //console.log(collections);
        let collectionNames = collections.map(collection => collection.name);
        if (!collectionNames.includes('counters')) {
          mongoose.connection.db.createCollection('counters', (err, result) => {
            result.insertOne({
              _id: 'client_code',
              seq: 0
            });
          });
        }
      });
  });

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório.";
mongoose.Error.messages.Number.min =
  "O valor '{VALUE}' informado é menor que o limite mínimo de '{MIN}'.";
mongoose.Error.messages.Number.max =
  "O valor '{VALUE}' informado é maior que o limite mínimo de '{MAX}'.";
mongoose.Error.messages.String.enum =
  "'{VALUE}' não é válido para o atributo '{PATH}'.";
