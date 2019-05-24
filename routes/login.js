var express = require('express');
var router = express.Router();
var passport = require('passport');
/// Générateur de token JWT
var jsonwebtoken = require('jsonwebtoken');
/// 
var opts = {
   secretOrKey: 'secret'
}

/* POST users listing. */
router.post('/', passport.authenticate('local', {successRedirect: '/',
                                                failureRedirect: '/frmlogin.html',
                                                failureFlash: false
   }));

   router.post('/jwt', (req,res)=>{
      /// Génération du Token (jeton)
      var jeton = jsonwebtoken.sign({id : req.body.usernaname}, opts.secretOrKey)
      /// Reponse au client
      res.send({token : jeton});
   });

   router.get('/testjwt', passport.authenticate('jwt', {session : false}), (req,res)=>{
      res.send({message: "C'est ok !!!"})
   });

module.exports = router;
