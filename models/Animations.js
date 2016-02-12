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
	liste_options: [
		{
			_id : String,
			titre : String,
			description : String,
			__v : Number
		}
	]
});

AnimationsSchema.methods.decrPlaceDispo = function(a){
	this.place_dispo -= 1;
	this.save(a);
}

AnimationsSchema.methods.incrPlaceDispo = function(a){
	this.place_dispo += 1;
	this.save(a);
}

mongoose.model('Animation', AnimationsSchema);