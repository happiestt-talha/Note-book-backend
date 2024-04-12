const connectToMongo=require('./db');
const express = require('express');

connectToMongo();
const app = express();
const port = 3000;

app.use(express.json());
//  default main route 
app.get('/', (req, res) => res.send('Hello from main route'));
//? routes to baki programs
app.use('/auth',require('./routes/auth'));
app.use('/notes',require('./routes/notes'))
app.listen(port, () => {
  console.log(`Notebook is listening on port >> http://localhost:${port} << sir!...`)
})