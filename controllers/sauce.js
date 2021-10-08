const { json } = require("body-parser");
const Sauce = require("../models/Sauce");

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

  Sauce.deleteOne({ _id: req.params.id })

    .then(() => res.status(200).json({ message: 'Deleted !'}))
    .catch(error => res.status(400).json({ error }));
};

//exports.likeSauce = (req, res , next) =>


