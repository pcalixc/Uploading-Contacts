import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const corsOptions = {
  origin: 'https://8j5baasof2.execute-api.us-west-2.amazonaws.com', // Permitir cualquier origen que necesites
  optionsSuccessStatus: 200,
};

app.get('', cors(corsOptions), (req: Request, res: Response) => {
  res.json({ msg: 'Hello :)' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


