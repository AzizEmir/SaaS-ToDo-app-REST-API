"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserConroller_1 = require("../controllers/UserConroller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Kullanıcı oluşturma
router.post('/register', UserConroller_1.createUser);
// Kullanıcı girişi ve JWT oluşturma
router.post('/login', UserConroller_1.loginUser);
/**
 * ! Admin Required START
 */
// Kullanıcıyı ID ile alma
router.get('/users/:id', authMiddleware_1.authMiddleware, UserConroller_1.getUserById);
// Tüm kullanıcıları listeleme
router.get('/users', authMiddleware_1.authMiddleware, UserConroller_1.getAllUsers);
// Kullanıcıyı ID ile silme
router.delete('/users/:id', authMiddleware_1.authMiddleware, UserConroller_1.deleteUserById);
/**
 * ! Admin Required END
 */
exports.default = router;
