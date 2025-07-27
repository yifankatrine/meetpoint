import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import router from "../routes/routes.js";

const PORT = process.env.PORT || 9000;


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/api', router);

// const allowedIP = '192.168.150.129';
//
// app.use(
//     cors({
//       origin: `http://${allowedIP}`,
//       optionsSuccessStatus: 200,
//     })
// );

app.get('/', (req, res) => {
  res.send('Server start :)');
});

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server start in http://localhost:${PORT}`);
    });
  }
  catch (e) {
    console.error(e);
  }
}

start()

export default start;