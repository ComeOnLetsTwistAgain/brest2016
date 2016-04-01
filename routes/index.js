
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var multer = require('multer');


var app = require('../app');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

var upload_img_anim = multer({
  storage : storage
}).single('image');

/*SOCKETS*/



var option_model = mongoose.model('Option'); 
var Animation = mongoose.model('Animation');

var User = mongoose.model('User');
var Billet = mongoose.model('Billet');
var Reservation = mongoose.model('Reservation');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/*
*   HOME
*/

var returnRouter = function(io) {

  router.get('/', function(req, res) {
    res.render('index');
  });

  // #######################################################

  /*
  *   UPLOADS
  */

  router.post('/img_anim', function(req, res){
    upload_img_anim(req, res, function(err){
      if(err) {console.log('erreur lors de l upload')}

      console.log(req.file.filename);
      res.redirect('/#/home');
    })
  });


  // #######################################################



  /*
  *
  *   USERS
  */

  router.get('/users', function(req, res, next) {
    User.find(function(err, users){
      if(err) {return next(err);}
      res.json(users);
    })
  });

  router.delete('/user/:id/remove', function(req, res, next){
    User.findById(req.params.id, function(err, user){
      if(err) { return next(err);}
      if(!user) { console.log('lalalala');}

      user.remove(function(err){
        if(err){return next(err);}
        return res.send(204);
      })
    })
  });


  // #######################################################

  // #######################################################

  /*
  *   REGISTER
  */

  router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
      if(err){ return next(err); }

      return res.json({token: user.generateJWT()})
    });
  });

  // #######################################################

  /*
  *   LOGIN
  */

  router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message: 'Please fill out all fields'});
    }

    console.log('calling passport)');
    passport.authenticate('local', function(err, user, info){
      if(err){ return next(err); }

      if(user){
        return res.json({token: user.generateJWT()});
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  });

  // #######################################################

  /* 
  * ANIMATIONS 
  */

  // paramètre pour animation
  router.param('animation', function(req, res, next, id) {
    var query = Animation.findById(id);

    query.exec(function (err, animation){
      if (err) { return next(err); }
      if (!animation) { return next(new Error("can't find animation")); }

      req.animation = animation;
      return next();
    });
  });

  // route pour l'ensemble des animations
  router.get('/animations', function(req, res, next) {
    
    Animation.find(function(err, animations){
      if(err){ 
        return next(err);
      }

      res.json(animations);
    }).populate('optionss');
  });

  // route pour la création d'une animation
  router.post('/animations', auth, function(req, res, next) {
    var animation = new Animation(req.body);
    animation.save(function(err, animation){
      if(err){ return next(err); }

      io.sockets.emit('client_call_animations', 'nouvelle animation ajoutée');

      res.json(animation);
    });
  });

  router.delete('/animations/:id/remove', function(req, res, next) {
    Animation.findById(req.params.id, function(err, animation) {
      if(err) { return next(err);}
      if(!animation) { return res.send(404);}
      animation.remove(function(err) {
        if(err) { return handleError(res, err); }
        io.sockets.emit('client_call_animations', 'animation supprimée');
        return res.send(204);
      });
    });
  });


  router.get('/animations/:id/edit', function(req, res, next) {
    Animation.findById(req.params.id, function(err, animation) {
      if(err) { 
        return next(err);
      }
      if(!animation) { 
        console.log("404 - /animations/:id/edit");
        return res.send(404);
      }
      return res.json(animation);
    });
  });

  router.get('/animations/:id', function(req, res, next) {
    Animation.findById(req.params.id, function(err, animation) {
      if(err) { 
        return next(err);
      }
      if(!animation) { 
        console.log("404 - /animations/:id/edit");
        return res.send(404);
      }
      return res.json(animation);
    }).populate('optionss');
  });

  router.put('/animations/:id/decrPlaceDispo',  function(req, res, next) {
    Animation.findById(req.params.id, function(err, animation){
      if(err){return next(err);}
      if(!animation) {return res.send(404);}

      animation.decrPlaceDispo(function(err, animation){
        if(err){return next(err);}
        res.json(animation);
        io.sockets.emit('client_call_animations', 'nouvelle animation ajoutée');
      }, req.body.infos.nbPlaces);
      
    });
  });

  router.put('/animations/:id/incrPlaceDispo',  function(req, res, next) {
    Animation.findById(req.params.id, function(err, animation){
      if(err){return next(err);}
      if(!animation) {return res.send(404);}

      animation.incrPlaceDispo(function(err, animation){
        if(err){return next(err);}
        res.json(animation);
        io.sockets.emit('client_call_animations', 'nouvelle animation ajoutée');
      }, req.body.infos.nbPlaces);
      
    });
  });



  router.put('/animations/:id', function(req, res, next) {
    
    
    Animation.findById(req.params.id, function(err, animation) {
      
      animation.libelle = req.body.animation.libelle;
      animation.description = req.body.animation.description;
      animation.nom_image = req.body.animation.nom_image;
      animation.place_dispo = req.body.animation.place_dispo;
      animation.place_max = req.body.animation.place_max;
      animation.date = req.body.animation.date;
      animation.heure_debut = req.body.animation.heure_debut;
      animation.heure_fin = req.body.animation.heure_fin;
      animation.optionss = req.body.animation.optionss;

      animation.save(function (err) {
        if (err) return handleError(err);
        io.sockets.emit('client_call_animations', 'nouvelle animation ajoutée');
        res.send(animation);
      });
    });
  });

  // #######################################################

  /* 
  * RESERVATION
  */

  // paramètre réservation
  router.param('reservation', function(req, res, next, id) {
    var query = Reservation.findById(id);

    query.exec(function (err, reservation){
      if (err) { return next(err); }
      if (!reservation) { return next(new Error("can't find reservation")); }

      req.reservation = reservation;
      return next();
    });
  });

  // route pour l'ensemble des réservations
  router.get('/reservations', function(req, res, next) {
    Reservation.find(function(err, reservations){
      if(err){ 
        return next(err);
      }

      res.json(reservations);
    }).populate('optionss');
  });

  router.get('/mes_reservations/:user', auth, function(req, res, next){
    Reservation.find({'user': req.params.user}, function(err, reservations){
      if(err){ return next(err); } 

      //call socket
      

      res.json(reservations);
    }).populate('optionss').populate('animation');
  });


  // route pour la création d'une réservation 
  router.post('/reservations', auth, function(req, res, next) {
    var reservation = new Reservation(req.body);

    reservation.save(function(err, reservation){
      if(err){ return next(err); }

      io.sockets.emit('client_call_mes_reservations', 'nouvelle reservation ajoutée');
      res.json(reservation);
    });
  });

  router.delete('/reservations/:id/remove', auth, function(req, res, next){
    Reservation.findById(req.params.id, function(err, reservation){
      if(err){return next(err);}
      if(!reservation){ return next(new Error("Can't find reservation"));}

      reservation.remove(function(err) {
        if(err) { return handleError(res, err); }
        io.sockets.emit('client_call_mes_reservations', 'reservations supprimée');
        return res.send(204);
      });
    });
  });

  // #######################################################

  /* 
  * OPTION
  */

  // parametre option
  router.param('option', function(req, res, next, id) {
    var query = option_model.findById(id);  

    query.exec(function (err, option){
      if (err) { return next(err); }
      if (!option) { return next(new Error("can't find option")); }

      req.option = option;
      return next();
    });
  });

  // route pour l'ensemble des options
  router.get('/options', function(req, res, next) {
    option_model.find(function(err, options){ 
      if(err){ 
        return next(err);
      }

      res.json(options);
    });
  });

  router.get('/options/:id', function(req, res, next) {
    option_model.findById(req.params.id, function(err, option) {
      if(err) { return next(err);}
      if(!option) { return res.send(404);}
     
      return res.json(option);
    });
  });

  // route pour la création des options
  router.post('/options', auth, function(req, res, next) {
    var option = new option_model(req.body); 

    option.save(function(err, option){
      if(err){ return next(err); }

      res.json(option);
    });
  }); 

  router.delete('/options/:id/remove', function(req, res, next) {
    option_model.findById(req.params.id, function(err, option) {
      if(err) { return next(err);}
      if(!option) { return res.send(404);}
      option.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(204);
      });
    });
  });


  // #######################################################

  /* 
  * BILLET
  */

  // parametre billet
  router.param('billet', function(req, res, next, id) {
    var query = Billet.findById(id);  

    query.exec(function (err, billet){
      if (err) { return next(err); }
      if (!billet) { return next(new Error("can't find billet")); }

      req.billet = billet;
      return next();
    });
  });

  // route pour l'ensemble des billets
  router.get('/billets', function(req, res, next) {
    Billet.find(function(err, billets){ 
      if(err){ 
        return next(err);
      }

      res.json(billets);
    });
  });

  router.get('/billets/:id', function(req, res, next) {
    Billet.findById(req.params.id, function(err, billet) {
      if(err) { return next(err);}
      if(!billet) { return res.send(404);}
     
      return res.json(billet);
    });
  });

  // route pour la création des billets
  router.post('/billets', auth, function(req, res, next) {
  //router.post('/billets', function(req, res, next) {  // pour insérer en base des données sans Auth
    var billet = new Billet(req.body); 

    billet.save(function(err, billet){
      if(err){ return next(err); }

      res.json(billet);
    });
  }); 

  router.delete('/billets/:id/remove', function(req, res, next) {
    Billet.findById(req.params.id, function(err, billet) {
      if(err) { return next(err);}
      if(!billet) { return res.send(404);}
      billet.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(204);
      });
    });
  });

  return router;
}

// ligne a conserver à la fin pour l'export des routes définies
module.exports = returnRouter;