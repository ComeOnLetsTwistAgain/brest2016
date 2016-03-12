var mongoose = require('mongoose');

var AnimationsSchema = new mongoose.Schema({
	//id_animation : {type: Number, unique: true},
	libelle: String,
	description: String,
	nom_image : String,
	place_dispo : Number,
	place_max : Number,
	date : Date,
	heure_debut : String,
	heure_fin : String, 
	optionss: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

AnimationsSchema.methods.decrPlaceDispo = function(a, nbPlaces){
	this.place_dispo -= nbPlaces;
	this.save(a);
}

AnimationsSchema.methods.incrPlaceDispo = function(a, nbPlaces){
	this.place_dispo += nbPlaces;
	this.save(a);
}

mongoose.model('Animation', AnimationsSchema);