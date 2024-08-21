"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.deleteUserById = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
// Kullanıcı oluşturma
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Şifreyi hash'leme
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const newUser = new User_1.default({
            //id: uuidv6
            firstName,
            lastName,
            email,
            password: hashedPassword,
            //isAdmin: false
        });
        const savedUser = yield newUser.save();
        res.status(201).json({
            data: savedUser,
            error: null
        });
    }
    catch (error) {
        // Hata mesajını kontrol et ve `errmsg` alanını döndür
        const errorMsg = error instanceof Error && error.message.includes('duplicate key error')
            ? error.errmsg || 'An error occurred'
            : 'Internal Server Error';
        res.status(500).json({
            data: null,
            error: {
                errmsg: errorMsg
            }
        });
    }
});
exports.createUser = createUser;
// Kullanıcıyı ID ile alma
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                data: null,
                error: 'User not found'
            });
            return;
        }
        res.status(200).json({
            data: user,
            error: null
        });
    }
    catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
});
exports.getUserById = getUserById;
// Tüm kullanıcıları listeleme
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('-password');
        ;
        res.status(200).json({
            data: users,
            error: null
        });
    }
    catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
});
exports.getAllUsers = getAllUsers;
// Kullanıcıyı ID ile silme
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield User_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({
                data: null,
                error: 'User not found'
            });
            return;
        }
        res.status(200).json({
            data: deletedUser,
            error: null
        });
    }
    catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
});
exports.deleteUserById = deleteUserById;
// Kullanıcı girişi ve JWT oluşturma
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({
                data: null,
                error: 'Invalid credentials'
            });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                data: null,
                error: 'Invalid credentials'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({
            data: { token },
            error: null
        });
    }
    catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
});
exports.loginUser = loginUser;
