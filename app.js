import express from 'express';
import { connectToDatabase } from './config/DatabaseConfig.js';
import userRouter from './routes/auth.router.js';

connectToDatabase();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(userRouter);

app.listen(port, () => {
 console.log(`Listening on port: ${port}`)
})
