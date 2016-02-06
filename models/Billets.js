var mongoose = require('mongoose');

var BilletSchema = new mongoose.Schema({
  //id_billet : {type: Number, unique: true},
  code_billet: {type: Number, default: 0},
  is_used: Boolean
});



mongoose.model('Billet', BilletSchema);
