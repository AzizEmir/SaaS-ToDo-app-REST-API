import express from 'express';
import { createUser, getUserById, getAllUsers, deleteUsersByIds, loginUser, changePassword } from '../controllers/UserConroller';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Kullanıcı oluşturma
router.post('/register', createUser);
// Kullanıcı girişi ve JWT oluşturma
router.post('/login', loginUser);
// Kullanıcı parola değiştirme
router.patch('/change-password', authMiddleware, changePassword);

/**
 * ! Admin Required START
 */

// Kullanıcıyı ID ile alma
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
// Tüm kullanıcıları listeleme
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
// Kullanıcıyı ID ile silme
router.delete('/users/', authMiddleware, adminMiddleware, deleteUsersByIds);

/**
 * ! Admin Required END
 */

export default router;
