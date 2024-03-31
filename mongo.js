const mongoose = require('mongoose')

const PersonSchema = new mongoose.Schema({
  _id: String,
  name: String,
  number: String,
})

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
// connect to the database
const connectionStr = `mongodb+srv://anna:${password}@fullstack.9qs6gkk.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`
mongoose.connect(connectionStr, {})
const Person = mongoose.model('Person', PersonSchema)

// No Password to github
const correctPassword = 'Anna1998'

if (password !== correctPassword) {
  console.log('Invalid password')
  process.exit(1)
}

const getMaxId = async () => {
  try {
    const maxId = await Person.find().sort({ _id: -1 }).exec()
    if (maxId.length === 0) {
      return 1
    }
    return maxId ? maxId._id + 1 : 1
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}

const addNewEntry = async () => {
  const nextId = await getMaxId()
  if (nextId === null) {
    console.log('Error: Error adding entry to phone book')
    mongoose.connection.close()
    process.exit(1)
  }
  const newEntry = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    number: number,
  })
  try {
    await newEntry.save()
    console.log(`Added ${name} number ${number} to Person`)
  } catch (error) {
    console.log('Error:', error)
  }
  mongoose.connection.close()
}

const fetchAllEntries = async () => {
  const data = await Person.find()
  console.log('Person:')
  data.forEach(entry => {
    console.log(`${entry.name} ${entry.number}`)
  })
  mongoose.connection.close()
  process.exit(1)
}

if (process.argv.length === 3) {
  fetchAllEntries()
} else if (process.argv.length === 5) {
  addNewEntry()
}

module.exports = {
  addNewEntry,
  fetchAllEntries
}