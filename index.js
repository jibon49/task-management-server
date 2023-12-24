const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('task management ')
  })
  
  app.listen(port, () => {
    console.log(`task management running on ${port}`)
  })