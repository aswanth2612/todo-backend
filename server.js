const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//connecting mongoose
mongoose.connect('mongodb://localhost:27017/todo-app')
.then(() =>{
  console.log('DB connected')
})
.catch((err) =>{
  console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String
})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);

//create apis
app.post('/todo', async (req,res)=>{
  const {title, description} = req.body;
  
  try{
    const newTodo = new todoModel({title, description});
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
  

})

//get apis
app.get('/todo', async (req, res) =>{
  try {
    const todo = await todoModel.find();
    res.json(todo);
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
})

//update items
app.put('/todo/:id', async (req, res) => {
  try {
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
     id,
      { title, description},
      { new: true }
    )

  if(!updatedTodo) {
    return res.status(404).json({message: "Todo not found"})
  }
  res.json(updatedTodo)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
})

//delete item
app.delete('/todo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
  
})

//start server
const port = 3000;
app.listen(port, ()=>{
  console.log('server is listening' +port);
})