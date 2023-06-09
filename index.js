const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const shortid = require('shortid');
require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(mongoURI)
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('urlshortener');
    const urlsCollection = db.collection('urls');

    // Route for shortening the URL
    app.post('/shorten', (req, res) => {
      const longUrl = req.body.longUrl;
      const shortCode = shortid.generate();

      urlsCollection.insertOne({ shortCode, longUrl })
        .then(() => {
          res.json({ shortUrl: `http://kamron.dev:3000/${shortCode}` });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        });
    });

    app.get('/:shortCode', (req, res) => {
      const shortCode = req.params.shortCode;

      urlsCollection.findOne({ shortCode })
        .then(result => {
          if (result) {
            res.redirect(result.longUrl);
          } else {
            res.status(404).json({ error: 'Short URL not found' });
          }
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        });
    });

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
