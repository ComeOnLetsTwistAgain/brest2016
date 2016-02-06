var mongoose = require('mongoose');

var ReservationsSchema = new mongoose.Schema({
	//id_reservation: {type: Number, unique: true},
	utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	nb_place_reservee: Number,
	animation: { type: mongoose.Schema.Types.ObjectId, ref: 'Animation' },
	liste_options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }]
});

mongoose.model('Reservation', ReservationsSchema);