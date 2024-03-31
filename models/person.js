const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const password = process.argv[2];
const connectionStr = `mongodb+srv://anna:${password}@fullstack.9qs6gkk.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`;
const url = connectionStr

console.log('connecting to', url)

mongoose.connect(url)

    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const PersonSchema = new mongoose.Schema({
    _id: String,
    name: String,
    number: String,
});

PersonSchema.set('toJSON', {})

module.exports = mongoose.model('Person', PersonSchema)