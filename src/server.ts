import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route';
import startCrons from './jobs/schedule';
import authRoutes from './routes/auth.route'

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(cors());
startCrons();

app.use('/api/users', userRoutes);

app.use('api/login', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
