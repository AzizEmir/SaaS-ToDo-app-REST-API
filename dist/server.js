"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
mongoose_1.default.Promise = Promise;
const mongodbUri = process.env.MONGODBURI || '';
mongoose_1.default.connect(mongodbUri);
mongoose_1.default.connection.on('connected', () => {
    console.log('Mongoose connection successful');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});
// Invalid JSON body middleware'i
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        res.status(400).json({
            data: null,
            error: 'Invalid JSON format'
        });
    }
    else {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
});
app.get('/', (req, res) => {
    res.status(200).json({
        data: "running normally",
        error: null
    });
});
app.use('/api', UserRoutes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
