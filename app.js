const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')
const app = express();


mongoose.connect('mongodb+srv://cedric:22061980@cluster0.eadww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
  


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces',sauceRoutes);

//-- export => pour accéder a l'application depuis les autres fichiers--//

module.exports = app;