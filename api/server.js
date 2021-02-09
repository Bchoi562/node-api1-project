// BUILD YOUR SERVER HERE

const express = require("express") //commonjs
const server = express();
server.use(express.json());
const db = require("./users/model");

server.get("/", (req, res) => {
    res.status(200).json({hello: "World"});
});


server.get("/api/users", (req, res) => {
    db.find()
        .then(users=>{
            res.status(200).json({users:users})
        })
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(user => {
            user
            ? res.status(200).json(user) : res.status(404).json({message: `no user with this id`})
        })
        .catch(error=>{
            res.status(500).json({error:error.message})
        })

});

server.post("/api/users", async ( req, res) => {
    const user = req.body
    if(!user.name || !user.bio){
        res.status(400).json({message: `name and bio are required`})
    }
    else{
        try{
            const newlyCreatedUser = await db.create(user)
            res.status(201).json(newlyCreatedUser)
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
})

server.put("/api/users/:id", async (req, res) => {
    const changes = req.body
    const { id } = req.params
    
    if(!changes.name || !changes.bio || changes.id === undefined){
        res.status(400).json({message:`name, bio and id are required`})
    }
    else{
        try{
            const updatedUser = await db.update(id, changes)
            if(updatedUser){
                res.status(200).json({message: `user not found with id`})
            }
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
})

server.delete("/api/users/:id", (req, res) => {
    const {id} = req.params
    db.remove(id)
    .then(deleted => {
        if(deleted){
            res.status(200).json(deleted)
        }
        else{
            res.status(404).json({message: `user not found with id`})
        }
    })
    .catch(error => {
        res.status(500).json({error:error.message})
    })
})




server.get("*", (req, res) =>{
    res.status(404).json({message:"404 Not Found :("})
});




module.exports = server; // EXPORT YOUR SERVER instead of {}
