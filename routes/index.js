var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

   ///   Gestion du compteur
   if (!("compteur" in req.session) ){
      req.session.compteur = 0;
   }
   req.session.compteur++;

   res.render('index', {
      title: 'Express',
      quand: new Date().toISOString(),
      nombreVisite: req.session.compteur
   });
});

module.exports = router;
