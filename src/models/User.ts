import { Schema, model, Document } from 'mongoose';
import { v6 as uuidv6 } from 'uuid';

export interface IUser extends Document {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdDate: Date;
    isAdmin: boolean; 
}

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        default: uuidv6
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

const User = model<IUser>('User', userSchema);

export default User;
