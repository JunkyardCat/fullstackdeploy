const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

//const url = `mongodb+srv://fullstackmongodb:${password}@cluster0.0y8esyf.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url).then(result=>{
    console.log('connected to MongoDB')
})
.catch((error)=>{
    console.log("error connecting to Mongodb",error.message)
})

const personSchema = new mongoose.Schema({

    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: [{
            
            validator: function(number) {
                if((number[2]==='-' || number[3]==='-')){
                    return true 
                }
                return false 
            },
            message: "invalid phonenumber format"
        },
        {
          validator: function(number) {
            return /^\d{2,3}-\d+$/.test(number);

          },
          message: "invalid phone number"  
        }],

        required: true
    }
})

personSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)