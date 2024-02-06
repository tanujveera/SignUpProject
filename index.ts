import express from "express";
const cors = require('cors');
import {router} from './routes/user';

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use('/users',router);

app.listen(PORT,()=>{
  console.log("Application listening at http://localhost:"+PORT);  
})