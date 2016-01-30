var mongoose = require('mongoose');

var OptionsSchema = new mongoose.Schema({
	titre: String,
	description: String
});

mongoose.model('Option', OptionsSchema);