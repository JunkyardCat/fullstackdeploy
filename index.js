const express = require('express')
const morgan = require('morgan')

const app = express()

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
        "content": "Arto Hellas",
        "number":"040-123456"
    },
    {
        "id": 2,
        "content": "Ada Lovelace",
        "number":"39-44-5323523"
    },
    {
        "id": 3,
        "content": "Dan Abramov",
        "number":"12-43-234345"
    },
    {
        "id": 4,
        "content": "Mary Poppendieck",
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

app.get('/api/persons', (request, response)=>{
    response.json(entries)
})

app.get('/info',(request, response)=>{
    response.send(`<p>Phonebook has info for ${entries.length}</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    const person = entries.find(entry=>entry.id===id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    const person = entries.find(entry=>entry.id===id)
    response.status(204).end()
})

const generatedId = () => {
    //const maxId = entries.length>0?Math.max(...entries.map(n=>n.id)):0
    const maxId = Math.floor(Math.random()*entries.length)
    return maxId+1
}
const findDuplicate =() =>{

}

app.post('/api/persons',(request,response)=>{
    const person = request.body
    const dupefound= entries.find(entry=>entry.content===person.content)
    //console.log(dupefound)
    if(dupefound){
        //console.log("found dupe")
        return response.status(400).json({error:'name must be unique'})
    }
    if(!person.content || !person.number){
        return response.status(400).json({error:'content missing'})
    }


    const person2 = {
        id: generatedId(),
        content: person.content,
        number: person.number || false,
    }
    entries=entries.concat(person2)
    response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
