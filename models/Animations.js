var mongoose = require('mongoose');

var AnimationsSchema = new mongoose.Schema({
	titre: String,
	description: String,
	listeOptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

mongoose.model('Animation', AnimationsSchema);