const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express()

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true,useUnifiedTopology:true})
const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model("Articles",articleSchema)
app.route("/articles")
.get((req,res)=>{
    Article.find((err,foundArticles)=>{
        if(!err){
            res.send(foundArticles)
        }else{
            res.send(err)
        }
    })
})
.post((req,res)=>{
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save((err)=>{
        if(!err){
            res.send("Successfully added a new article")
        }else{
            res.send(err)
        }
    })
})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfully Deleted All articles")
        }else{
            res.send(err)
        }
    })
})

app.route("/articles/:articleTitle")

.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No articles matching that title was found")
        }
    })
})

.put((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully Updated")
            }else{
                res.send(err)
            }
        }
    )
})

.patch((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated")
            }else{
                res.send(err)
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the article")
            }else{
                res.send(err)
            }
        }
    )
})
app.listen(3000,()=>{
    console.log("Server Up")
})