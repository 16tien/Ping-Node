import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import startCrons from './jobs/schedule';

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());

startCrons();

app.use('/api/users', userRoutes);
app.use('/api/', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
