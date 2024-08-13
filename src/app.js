import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import matRoutes from './routes/materiales.routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();


app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
  }));
  
app.use(express.json())
app.use("/api", authRoutes)
app.use("/api", matRoutes)
app.use(bodyParser.json());



export default app;