const todolist = require('./models/TodoList')
require('dotenv-flow').config();
const bodyParser = require('body-parser')
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();


app.use(cors())
app.use(bodyParser.json());

// CORS 設定，以及將 Content-Type 設定為 application/json，省去轉換
// const header = {
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
//     'Content-Type': 'application/json'
// }

// 暫存 todo-list data
const data = []

mongoose.connect(process.env.URL_MONGOOSE);
mongoose.connection.once('open', () => console.log('connected to database'));
mongoose.connection.on('error', (error) => console.error('database error', error));

// 新增 todos
app.post("/api/todos", async (req, res) => {
    console.log('---- [POST] 開始 ----');
    try{
        console.log('---- [POST] 進入 try，開始設定 todo item ----');
        const item = { 
            ...req.body,
            dueDate: Date.now(),
        }
        console.log('---- [POST] 設定 todo item 完畢，進入 new todolist(item) ----');
        const todo = new todolist(item)
        console.log('---- [POST] 設定 new todolist(item)完畢，開始 await todo.save() ----');
        const result = await todo.save()

        console.log('---- [POST] 開始傳輸 API 回應 ----');
        // res.set(header)
        res.send(`${result} 
        save 成功`)
    }catch(err){
        const errMsg = `POST Error ${err}`
        res.send({message: errMsg})
    }
    console.log('---- [POST] 結束 ----');
})

// 修改 todos
app.patch("/api/todos/:id", async (req, res) => {
    const  {id: _id}  = req.params
    const item = { 
        ...req.body,
        _id,
        dueDate: Date.now(),
    }
    try{
        const result = await todolist.findOneAndUpdate({_id: _id }, {...item},{new: true})
        // res.set(header)
        res.send(`${result} 修改完成`)
    }catch{
        res.send({message: 'PATCH Error'})
    }
})

// 刪除所有 todos
app.delete("/api/todos", async (req, res) => {
    try{
        const result = await todolist.deleteMany({})
        // res.set(header)
        res.send(result)
    }catch{
        res.send({message: 'DELETE Error'})
    }
})

// 刪除單筆 todos
app.delete("/api/todos/:id", async (req, res) => {
    const  {id: _id}  = req.params
    try{
        const result = await todolist.findOneAndDelete({_id: _id })
        // res.set(header)
        res.send(result)
    }catch{
        res.send({message: 'DELETE Error'})
    }
})

// 取得所有 todos
app.get("/api/todos", async (req, res) => {
    console.log('---- [GET] 開始 ----');
    try{
        const result = await todolist.find({})
        // res.set(header)
        res.send(result)
    }catch{
        res.send({message: 'GET Error'})
    }
    console.log('---- [GET] 結束 ----');
})

// 取得單一 todos
app.get("/api/todos/:id", async (req, res) => {
    const  {id: _id}  = req.params
    try{
        const result = await todolist.findById(_id)
        // res.set(header)
        res.send(result)
    }catch{
        res.send({message: 'GET Error'})
    }
})

// 404
app.get("*", function (req, res) { 
    res.status(404);
    // res.set(header)
    res.send({message: '無此 GET API'})
})

app.post("*", function (req, res) { 
    res.status(404);
    // res.set(header)
    res.send({message: '無此 POST API'})
})

app.delete("*", function (req, res) { 
    res.status(404);
    // res.set(header)
    res.send({message: '無此 DELETE API'})
})

const port = process.env.PORT || 3000

app.listen(port, () => { 
    console.log("Server is running on port " + port);
})