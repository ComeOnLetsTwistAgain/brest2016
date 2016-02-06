var mongoose = require('mongoose');

var OptionsSchema = new mongoose.Schema({
	//id_option : {type: Number, unique: true},
	titre: String,
	description: String
});

mongoose.model('Option', OptionsSchema);