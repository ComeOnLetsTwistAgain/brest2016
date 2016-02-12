var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var option_model = mongoose.model('Option'); 
var Animation = mongoose.model('Animation');

var User = mongoose.model('User');
var Billet = mongoose.model('Billet');
var Reservation = mongoose.model('Reservation');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/*
*   HOME
*/

router.get('/', function(req, res) {
  res.render('index');
});

// #######################################################


/*
*   POSTS A supprimer dans le future
*/
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ 
      return next(err);
    }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;
  
  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

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
  });
});

// route pour la création d'une animation
router.post('/animations', auth, function(req, res, next) {
  var animation = new Animation(req.body);

  animation.save(function(err, animation){
    if(err){ return next(err); }

    res.json(animation);
  });
});

router.delete('/animations/:id/remove', function(req, res, next) {
  Animation.findById(req.params.id, function(err, animation) {
    if(err) { return next(err);}
    if(!animation) { return res.send(404);}
    animation.remove(function(err) {
      if(err) { return handleError(res, err); }
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
  });
});

// router.get('/options/:id', function(req, res, next) {
//   option_model.findById(req.params.id, function(err, option) {
//     if(err) { return next(err);}
//     if(!option) { return res.send(404);}
   
//     return res.json(option);
//   });
// });


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
    animation.liste_options = req.body.animation.liste_options;

    animation.save(function (err) {
      if (err) return handleError(err);
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
  });
});


// route pour la création d'une réservation 
router.post('/reservations', auth, function(req, res, next) {
  var reservation = new Reservation(req.body);

  reservation.save(function(err, reservation){
    if(err){ return next(err); }

    res.json(reservation);
  });
});

// #######################################################

/* 
* OPTION
*/

// parametre option
router.param('option', function(req, res, next, id) {
  // var query = Reservation.findById(id);
  var query = option_model.findById(id); // TODO: coloration en bleu de option normale ?? 

  query.exec(function (err, option){
    if (err) { return next(err); }
    if (!option) { return next(new Error("can't find option")); }

    req.option = option;
    return next();
  });
});

// route pour l'ensemble des options
router.get('/options', function(req, res, next) {
  option_model.find(function(err, options){ // TODO: coloration en bleu de option normale ?? 
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
  var option = new option_model(req.body); // TODO: coloration en bleu de option normale ??

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


// ligne a conserver à la fin pour l'export des routes définies
module.exports = router;