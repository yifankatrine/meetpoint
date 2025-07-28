import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import router from "../routes/routes.js";

const PORT = process.env.PORT || 5000;


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/api', router);


app.get('/', (req, res) => {
  res.send('Server start :)');
});

const start = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server start on http://0.0.0.0:${PORT}`);
    });
  }
  catch (e) {
    console.error(e);
  }
}

start()

export default start;
