// server/index.js
import express from 'express';
import { Client } from 'pg'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());

const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Danya3300ukrVel",
  database: "investiq"
})

con.connect().then(() => console.log("connected"))



// POST function
app.post('/addUser', (req, res) => {

  const { username, password, email, user_id } = req.body
  const insert_query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)'
  con.query(insert_query, [username, password, email], (err, result) => {

    if (!err) {
      console.log(result);
      res.send("POSTED DATA")
    } else {
      res.send(err)
    }

  })

})

app.post('/postRow', (req, res) => {

  const { date, description, categorie, sum, user_id } = req.body
  const insert_query = 'INSERT INTO data (description, categorie, sum, user_id, date) VALUES ($1, $2, $3, $4, $5)'
  con.query(insert_query, [description, categorie, sum, user_id, date], (err, result) => {

    if (!err) {
      console.log(result);
      res.send("POSTED DATA")
    } else {
      res.send(err)
    }

  })

})

//POST LIST function
// app.post('/postList', async (req, res)=>{
//   const data = req.body
//   try{
//     for(const i of data){
//       const {name, id} = i
//       await con.query('INSERT INTO users (username, user_id) VALUES ($1, $2)', [name, id])
//     }
//     res.send("POSTED")
//   }catch(err){
//     res.send(err)
//   }})

// FETCH ALL function
app.get('/data', (req, res) => {

  const query = "SELECT * FROM public.data"
  con.query(query, (err, result) => {
    if (!err) {
      console.log(result.rows);
      res.send(result.rows)
    } else {
      res.send(err)
    }
  })

})

// FETCH BY ID function
// app.get('/id/:id', (req, res) => {
//   const id = req.params.id
//   const fetch_query = "SELECT * FROM public.users where user_id = $1"
//   con.query(fetch_query, [id], (err, result) => {
//     if (err) {
//       res.send(err)
//     } else (
//       res.send(result.rows)
//     )
//   })
// })

// FETCH BY ID function
app.post('/id', (req, res) => {
  const { password, email } = req.body
  const fetch_query = "SELECT * FROM public.users where (password, email) = ($1, $2)"
  con.query(fetch_query, [password, email], (err, result) => {
    if (err) {
      res.send(err)
    } else (
      res.send(result.rows)
    )
  })
})

//PUT function
app.put('/put/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const query = "UPDATE public.users SET username = $1 WHERE user_id = $2"
  con.query(query, [name, id], (err, result) => {
    if (err) {
      res.send(err)
    } else (
      res.send(result.rows)
    )
  })
})

//DELETE function
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM public.users WHERE user_id = $1"

  con.query(query, [id], (err, result) => {
    if (err) {
      res.send(err)
    } else (
      res.send("DELETED")
    )
  })
})

// console.log that your server is up and running
app.listen(3000, () => {
  console.log("server is running...");
})