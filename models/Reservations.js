var mongoose = require('mongoose');

var ReservationsSchema = new mongoose.Schema({
	//id_animation : {type: Number, unique: true},
	id_animation: String,
	libelle_animation: String,
	user:String,
	nom_image : String,
	nbPlaceReserve : Number,
	listeOptions: [
		{
			_id : String,
			titre : String,
			description : String,
			__v : Number
		}
	]
});

mongoose.model('Reservation', ReservationsSchema);