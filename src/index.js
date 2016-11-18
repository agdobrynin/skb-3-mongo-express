import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import bodyParser from 'body-parser';

import Pet from './models/Pet';
import User from './models/User';
import SaveDataInDb from './saveDataInDb';
import isAdmin from './middleware/isAdmin';

mongoose.Promise = Promise;
//Connect 2 database
const config = require('./env.json');
mongoose.connect(`${config.dbMongo}`);

const app = express();
app.use(cors());
//app.use(isAdmin);

//Middleware for json in req.body
app.use(bodyParser.json());

//Clear all users and pets
app.get('/clear', isAdmin, async (req, res) => {
  await User.remove({});
  await Pet.remove({});
  return res.send('Clear all data');
});

//Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

//Get all pets with owner
app.get('/pets', async (req, res) => {
  const pets = await Pet.find().populate('owner');
  return res.json(pets);
});

//Post (write) data to MongoDB
app.post('/data', async (req, res) => {
  const data = req.body;

  //Validate data from body
  //@todo add some validator for req.body json data
  if( !data.user )
    return res.status(400).send('"user" requred in json');
  if ( data.pets === undefined )
    data.pets = [];

  const user = await User.findOne({
    name: data.user.name
  });

  if ( user )
    return res.status(400).send(`${user.name} is exist`);

  try {
    const result = await SaveDataInDb(data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json(e);
  }
  // return res.json();
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000 ...');
});
/*

const data = {
  "user": {
    "name": "Алексей Добрынин"
  },
  "pets": [
    {
      "type": "cat",
      "name": "Vanya"
    },
    {
      "type": "dog",
      "name": "Sharik"
  ]
};

SaveDataInDb(data);
*/
