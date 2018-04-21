require('dotenv').config()
var express = require('express')
const GoogleImages = require('google-images')
var {mongoose} = require('./db/mongoose')
var moment = require('moment')
var id = process.env.CSE_ID
var apiKey = process.env.CSE_API_KEY
var app = express()
var port = process.env.PORT || 3000
const client = new GoogleImages(id, apiKey)
var {SearchResults} = require('../models/imagesResult')
app.get('/', (req, res) => {
  res.send(`Welcome Home to Search Image Service 
  \nPlease use through: 
  \nImage search ${req.headers.host}/api/imagesearch/:search
  \nImage search's page ${req.headers.host}/api/imagesearch/:search?offset=
  \nFor search history: ${req.headers.host}/api/latest/imagesearch/`)
})

app.get('/api/imagesearch/:search', async (req, res) => {
  try {
    var imagesSearchResults = []
    var results = await client.search(req.params.search, {page: req.query.offset})
    await results.forEach(result => {
      var searchResult = {
        url: result.url,
        snippet: result.description,
        thumbnail: result.thumbnail.url,
        context: result.parentPage
      }
      imagesSearchResults.push(searchResult)
    })
    var searchHistory = await new SearchResults({
      term: req.params.search,
      when: moment().format('LLLL')
    })
    await searchHistory.save()
    await res.send(imagesSearchResults)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.get('/api/latest/imagesearch/', async (req, res) => {
  var historySearch = await SearchResults.find().select("-_id").select('-__v')
  res.send(historySearch)
})

app.listen(port, () => {
  console.log('Listening to port ', 3000)
})
