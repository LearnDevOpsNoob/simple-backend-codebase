import express from 'express';
import userRoutes from './routes/users.routes.js';
const app = express();



//Middlewares
app.use(express.json()); //now it can parse JSON data.

app.use('/api/v1/users', userRoutes)


export default app;