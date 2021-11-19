import dotenv from "dotenv";
import express, { json } from 'express';
import { getPosts, healthPing } from './routes/controller.js';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const app = express();


// Middleware
app.use(json());

// Routes



app.get('/api/ping', healthPing);
app.get('/api/posts/:tags?/:sortBy?/:direction?', getPosts);



// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));






