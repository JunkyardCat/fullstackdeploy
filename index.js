require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
/*
app.use(morgan('tiny',{skip: function(req,res){
    console.log("Method",req.method)
    console.log("Path",req.path)
    console.log("Body",JSON.stringify(req.body))
}}))
*/
morgan.token("data",(request)=>{
    return request.method === "POST" ? JSON.stringify(request.body):""
})

//app.use(morgan('tiny'))
app.use(morgan(":method :url :status :res[content-length] - response-time ms :data"))



let entries = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number":"040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number":"39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number":"12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number":"39-23-6423122"
    }
]
/*
const app = http.createServer((request, response)=>{
    response.writeHead(200,{'Content-Type': 'application/json'})
    response.end(JSON.stringify(entries))
})
*/

const logger = (request, response, next) =>{
    //console.log('Method:', request.method)
}

app.get('/',(request, response) =>{
    response.send('<h1>hello world</h1>')
})

/*
app.get('/api/persons', (request, response)=>{
    response.json(entries)
})
*/



app.get('/api/persons', (request, response)=>{
    console.log("inside person")
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

app.get('/api/persons/:id',(request, response, next)=>{
    Person.findById(request.params.id).then(person=>{
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    }).catch(error=>next(error))
})


app.get('/info',(request, response)=>{
    response.send(`<p>Phonebook has info for ${entries.length}</p>
    <p>${new Date()}</p>`)
})

/*
app.get('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    const person = entries.find(entry=>entry.id===id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
*/



/*
app.delete('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    entries = entries.filter(entry=>entry.id!==id)
    console.log(id,entries)
    response.status(204).end()
})
*/
app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndRemove(request.params.id).then(
        result=>{
            console.log(result)
            response.status(204).end()
        }
    ).catch(error=>next(error))
})

const generatedId = () => {
    //const maxId = entries.length>0?Math.max(...entries.map(n=>n.id)):0
    const maxId = Math.floor(Math.random()*100)
    return maxId+1
}
const findDuplicate =() =>{

}
/*
app.post('/api/persons',(request,response)=>{
    const person = request.body
    const dupefound= entries.find(entry=>entry.name===person.name)
    //console.log(dupefound)
    if(dupefound){
        //console.log("found dupe")
        return response.status(400).json({error:'name must be unique'})
    }
    if(!person.name || !person.number){
        return response.status(400).json({error:'content missing'})
    }


    const person2 = {
        id: generatedId(),
        name: person.name,
        number: person.number || false,
    }
    entries=entries.concat(person2)
    response.json(person)
})
*/
/*
app.post('/api/persons', (request, response)=>{
    const body = request.body
    let dupe = "false" 

    Person.find({name:body.name}).then(persons=>{
       console.log(persons,dupe)
       if(persons.length>0){
           console.log("inside person[]")
           dupe="true"
       }
    
        console.log("dupe value after",dupe)
        if(dupe==="true"){
            console.log("inside dupe")
            return response.status(400).json({error:'name must be unique'})
        }

        if(!body.name || !body.number){
            return response.status(400).json({error:'content missing'})
        }
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        
        person.save().then(savedPerson =>{
            response.json(savedPerson)
        })
    }) 
})
*/

app.post('/api/persons', (request, response, next)=>{
    const body = request.body
    /*
    if(!body.name || !body.number){
        return response.status(400).json({error:'content missing'})
    }
    */
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson =>{
        response.json(savedPerson)
    }).catch(error=>next(error))
    
})

app.put('/api/persons/:id',(request,response,next)=>{
    const body = request.body
    const person ={
        name:body.name,
        number:body.number,
    }
    console.log('inside',person,body.name,body.number)
    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'}).then(updatedPerson=>{
        response.json(updatedPerson)
    }).catch(error=>next(error))
})

const unknownEndpoint =(request, response)=>{
    response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next)=>{
    console.error(error.message)
    if(error.name==='CastError'){
        return response.status(400).send({error:'malformmatted id'})
    }else if (error.name=='ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
