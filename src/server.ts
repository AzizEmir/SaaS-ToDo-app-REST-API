import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes';
import taskRoutes from './routes/TaskRoutes';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.Promise = Promise;

const mongodbUri = process.env.MONGODBURI || '';
mongoose.connect(mongodbUri);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection successful');
});

mongoose.connection.on('error', (error: Error) => {
    console.error('Mongoose connection error:', error);
});

// Invalid JSON body middleware'i
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        res.status(400).json({
            data: null,
            error: 'Invalid JSON format'
        });
    } else {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        data: "running normally",
        error: null
    })
})
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
