var mongoose = require('mongoose');

var ReservationsSchema = new mongoose.Schema({
	//id_animation : {type: Number, unique: true},
	animation: {type: mongoose.Schema.Types.ObjectId, ref: 'Animation'},
	user:String,
	nom_image : String,
	nbPlaceReserve : Number,
	optionss: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

mongoose.model('Reservation', ReservationsSchema);