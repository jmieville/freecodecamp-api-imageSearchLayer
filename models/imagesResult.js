const mongoose = require('mongoose')

var searchResultSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    select: true
  },
  when: {
    type: String,
    required: true,
    select: true
  }
})

var SearchResults = mongoose.model('SearchResults', searchResultSchema)

module.exports = {SearchResults}
