import { Schema, model, Document } from 'mongoose';
import { v6 as uuidv6 } from 'uuid';

// Task interface definition
export interface ITask extends Document {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    userId: string; // User modelinin id'si ile ilişkili alan
}

// Task schema definition
const taskSchema = new Schema<ITask>({
    id: {
        type: String,
        required: true,
        default: uuidv6
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true,
        ref: 'User' // User modeline referans
    }
});

// Task model creation
const Task = model<ITask>('Task', taskSchema);

export default Task;