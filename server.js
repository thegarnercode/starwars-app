// server js 
const express = require('express');
const bodyParser = require('body-parser')


const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))


const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://thegarnercode:code2812@cluster0.3zw9t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{
  useUnifiedTopology: true })
   .then(client => {
  console.log('Connected to Database')
  const db = client.db('star-wars-quotes')
  const quotesCollection = db.collection('quotes')
  
  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
    .then(result => {
      res.redirect('/')
  })
  .catch(error => console.error(error))
})
  
  app.set('view engine', 'ejs')

  app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            upsert: true
        }
    )
    .then(result => {
        res.join('Success')
    })
    .catch(error => console.error(error))
})


  app.get('/', (req, res) => {
  const cursor = db.collection('quotes').find().toArray()
  .then(results => {
     res.render('index.ejs', { quotes: results })
    
  })
  .catch(error => console.error(error))
   
})

   })

app.delete('/quotes', (req, res) => {
  quotesCollection.deleteOne(
      { name: req.body.name },
  )
  .then(result => {
      if (result.deletedCount === 0) {
          return res.json('No quote to delete')
      }
      res.json(`Deleted Darth Vader's Quote`)
  })
  .catch(error => console.error(error))
})



app.listen(3000, function() {
  console.log('listening on 3000')

})






