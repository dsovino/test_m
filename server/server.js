const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/../public"));
app.use(bodyParser.json());

// DB
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/book')

const {Book} = require('./models/books');
const {Store} = require('./models/stores');


// POST
app.post('/api/add/store',(req,res)=>{
    console.log('getting post request')
    console.log(req.body)

    const store = new Store({
        name:req.body.name ,
        address:req.body.address,
        phone:req.body.phone
    })
    store.save((err,doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send();
    })
})

// POST
app.post('/api/add/book',(req,res)=>{
    console.log('getting post request')
    console.log(req.body)

    const book = new Book({
        name:req.body.name ,
        author:req.body.author,
        pages:req.body.pages,
        price:req.body.price,
        stores:req.body.stores
    })
    book.save((err,doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send();
    })
})

app.get('/api/stores',(req,res)=>{
    console.log('gettting stores list collection request');
    Store.find((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    });
})

app.get('/api/books',(req,res)=>{
    console.log('gettting books list collection request');
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    let order = req.query.order ? req.query.order : 'asc'
    Book.find().limit(limit).sort({name:order}).exec((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    });
})

app.get('/api/books/:book_id',(req,res)=>{
    console.log('gettting book item request');
    let id = req.params.book_id;
    Book.findById(id,(err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    });
})

app.patch('/api/add/books/:book_id',(req,res)=>{
    console.log('gettting book item UPDATE request');
    
    Book.findByIdAndUpdate(req.params.book_id,{$set:req.body},{new:true}, (err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})

app.delete('/api/delete/books/:book_id',(req,res)=>{
    console.log('gettting book item DELETE request');
    Book.findByIdAndRemove(req.params.book_id, (err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})

app.listen(port,()=>{
    console.log(`started at port ${port}`);
});




