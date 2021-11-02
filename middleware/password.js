const passwordValidator = require('password-validator');

// Creation schema
const passwordSchema = new passwordValidator();


passwordSchema
.is().min(8)                                    // longueur minimum  8
.is().max(100)                                  // longueur maximum  100
.has().uppercase()                              // doit contenir des majuscules
.has().lowercase()                              // doit contenir des minuscules
.has().digits(2)                                // doit contenir au moins 2 lettres
.has().not().spaces()                           // pas d'espaces

.has().not().symbols();                         //pas de caractères spéciaux


module.exports = (req ,res , next) => {
    if (passwordSchema.validate(req.body.password)) {

        next();
    }else{
       return res.status(400).json({error :'mot de passe trop faible: il doit contenir minimun 8 caractères, des majuscules , des minuscules, au moins 2 chiffres. Il ne doit contenir ni espaces ni caractères spéciaux. '}) 
   
}
}
