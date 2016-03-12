var mongoose = require('mongoose');

var ReservationsSchema = new mongoose.Schema({
	//id_animation : {type: Number, unique: true},
	id_animation: String,
	libelle_animation: String,
	user:String,
	nom_image : String,
	nbPlaceReserve : Number,
	optionss: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

mongoose.model('Reservation', ReservationsSchema);