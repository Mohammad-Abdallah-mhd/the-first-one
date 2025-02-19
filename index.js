'use strict';
const express =require('express')
const app=express();
require('axios')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors=require('cors')
const port =process.env.PORT || 3001
const {Client}=require('pg')
const url=process.env.DBURL ||`postgresql://studying_user:018LLQEojT6Ru9ue7e1ci9B94Y023Iyx@dpg-cuq88h9opnds73ej2ttg-a.frankfurt-postgres.render.com/studying`
const client = new Client({
    connectionString: url,
    ssl: {
      rejectUnauthorized: false, // تجاوز فحص الشهادات (مناسب للتطوير فقط)
    },
  });
//app.use(cors())
 //route
app.get('/',homehandler)
app.post('/saver',saverhandler)
app.get('/getit',getithandler)
app.put('/edit/:id',edithandler)
app.delete('/delete/:id',deletehandler)
app.get('/getmovie/:id',getmoviehandler)
//handlers
function getmoviehandler(req,res){
    let id =req.params.id;
    let sql =`SELECT * FROM study where id=$1;`
    let values=[id];
    client.query(sql,values).then(resu=>{
    res.json(resu.rows)
     
    }).catch()
}
function deletehandler(req,res){
    let id =req.params.id;
    console.log(id)
    let sql=`DELETE FROM study WHERE id=$1;`
    let values=[id];

client.query(sql,values).then(resu=>{
    
    res.send("yesss")
}).catch()

}
function getithandler(req,res){
    const sql=`SELECT * FROM study;`
    client.query(sql).then((resu)=>{
res.json(resu.rows)
    })
    .catch(err=>{
        res.send("aaaah")
    })
}
function saverhandler(req,res){
    
    const {Names ,Grade,Age}=req.body 
  const sql=`INSERT INTO study (Names, Grade, Age) VALUES 
     ($1,$2,$3) RETURNING *; `
    
const values=[Names,Grade,Age];
    client.query(sql,values).then((resu)=>{
    res.status(201).json(resu.rows)
    console.log("Database result:", resu.rows);

}).catch(error=>{
    res.send("ahhhh")
    
})
    
}

function homehandler(req,res){
    console.log("Hello");
    res.send("Welcome to the Home Route!");
}
function edithandler(req,res){
   
    let id =req.params.id;
    let {Names,Grade,Age}=req.body;
    let sql=`UPDATE study SET NAMES=$1 ,Grade=$2, age=$3
    Where id=$4;`;
    let values=[Names,Grade,Age,id]
    client.query(sql,values).then(resu=>{
res.send(resu.rows)
    }).catch()
}
//listener
client.connect()
.then(()=>{
    app.listen(port,()=>{

    console.log(`listening to port ${port}`);
    
})
})
.catch((err) => {
    console.error("Database connection failed:", err.stack); 
  });
