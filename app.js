var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

///   Gestion de passport
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var jwtStrtegy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var app = express();

///   Serial user passport
passport.serializeUser(function (user, done) {
   done(null, user);
});

passport.deserializeUser(function (user, done) {

   done(null, user);
});

/// Setup passport JWWT
var opts = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: 'secret'
}
passport.use(new jwtStrtegy(opts, function (jwt_payload, done) {
   ///   Traitement !!!
   /// TODO recuperation du user !!
   return done(null, {
      "id": "user1",
      "identifiant": "user1",
      "firstname": "user1",
      "lastname": "Rod",
      "password": "motdepasse1",
      "profit": "user"
   });
}
));

/// Setup passport
passport.use(new LocalStrategy(
   function (username, password, done) {
      /// Recherche de l'utilisateur dans le repertoire data
      var pathEtNomFichierUtilisateur = path.join(__dirname, 'data', username + '.json');
      console.log(pathEtNomFichierUtilisateur);

      /// Test si le fichier éxiste
      fs.exists(pathEtNomFichierUtilisateur, (ret) => {
         if (!ret) {
            /// Retourne utilisateur non trouvé
            return done(null, false, { message: 'Incorrect username.' });
         }
         ///  Lecture du fichier
         fs.readFile(pathEtNomFichierUtilisateur, (err, lesDonneesDuFichiers) => {
            if (err) {
               return done(null, false, { message: 'Pb sys.' });
            }

            ///   Transformation du texte récupéré du fichier JSON
            var objRead = JSON.parse(lesDonneesDuFichiers);

            ///   Test si mot de passe OK
            if (objRead.password === password) {
               return done(null, objRead); ///   C'est bon
            } else {
               return done(null, false, { message: 'Probleme username !!!' }); ///   C'est pas bon
            }
         });
      })


      /*
            User.findOne({ username: username }, function (err, user) {
               if (err) { return done(err); }
               if (!user) {
                  return done(null, false, { message: 'Incorrect username.' });
               }
               if (!user.validPassword(password)) {
                  return done(null, false, { message: 'Incorrect password.' });
               }
               return done(null, user);
            });/// Fin de la recherche dans la base
      */

   }/// Fin de la fonction d'authentification




));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'webdev' }));

app.use(express.static(path.join(__dirname, 'public')));

///   Mise en place du passport dans le middleware
app.use(passport.initialize()); /// Moteur
app.use(passport.session()); /// Gestionnaire de session de passport

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;
