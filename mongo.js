const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const pname = process.argv[3]
const pnumber = process.argv[4]

const url = `mongodb+srv://fullstackmongodb:${password}@cluster0.0y8esyf.mongodb.net/personApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length>3){
    const person = new Person({
        name: pname,
        number: pnumber,
    })


person.save().then(result =>{
    //console.log('record saved!')
    console.log(`added ${pname} number ${pnumber} to phonebook`)
    mongoose.connection.close()
})
}

if (process.argv.length==3){
    Person.find({}).then(result=>{
        console.log("phonebook:")
        result.forEach(persons=>{
            //console.log(note)
            console.log(persons.name, persons.number)
        })
        mongoose.connection.close()
    })
}

