const { json } = require("body-parser");
const Sauce = require("../models/Sauce");
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
 
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => {
      res.status(200).json({
        message: 'Thing updated successfully!'
      });
    })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce=> {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () =>{

      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Deleted !'}))
      .catch(error => res.status(400).json({ error }));
    })
  })
  .catch(error=> res.status(500).json({error}));

  
};

exports.likeSauce = async(req, res , next)  => {

  let like = req.body.like;
  let userId = req.body.userId;
  
  //Cherche la sauce dans la base de donnée
  let sauce = await Sauce.findOne({
    _id: req.params.id
  });

  //Par precaution au cas ou les likes/dislikes seraient vides
  //on les initialises
  if(!sauce.likes){ sauce.likes=0; }
  if(!sauce.dislikes){ sauce.dislikes=0; }


   if(like === 1){
    //on enleve le dislike precedent s'il y'en a 
   // if(sauce.usersLiked.includes(userId)){
    //  sauce.likes-=1;
    
      //sinon on incremente les like et on rajoute l'utilisateur dans le tableau des likes
      sauce.likes+=1;
      sauce.usersLiked.push(userId);
  }
    
      
  
  if (like === -1){
    //si l'utilisateur a deja disliker, on enleve son dislike
    //if(sauce.usersDisliked.includes(userId)){
     // sauce.likes-=1;
    
      //sinon on rajoute lui un dislike
      sauce.dislikes+=1;
      sauce.usersDisliked.push(userId);
    
  }
      
  if (like === 0 && sauce.usersDisliked.includes(userId)){
    
    sauce.usersDisliked.remove(userId);
    sauce.dislikes-=1

  }else if (like === 0 && sauce.usersLiked.includes(userId)) {

    sauce.usersLiked.remove(userId);
    sauce.likes-=1

  }
      
      
  
    
  console.log('helloo', sauce);
  //on enregistre la sauce en base
  Sauce.updateOne({ _id: req.params.id }, { ...{
                    likes: sauce.likes, 
                    dislikes: sauce.dislikes, 
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked}, _id: req.params.id })
  .then(() => {
    res.status(200).json({
      message: 'Sauce updated successfully!'
    });
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
    );

  

  }