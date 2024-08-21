import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Kullanıcı oluşturma
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Şifreyi hash'leme
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            // 'id' will be set automatically by the schema default value
            // 'isAdmin' will be set to default value (false)
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            data: savedUser,
            error: null
        });
    } catch (error) {
        // Hata mesajını kontrol et ve `errmsg` alanını döndür
        const errorMsg = error instanceof Error && error.message.includes('duplicate key error')
            ? 'Duplicate key error: ' + (error as any).message
            : 'Internal Server Error';

        res.status(500).json({
            data: null,
            error: {
                errmsg: errorMsg
            }
        });
    }
};

// Kullanıcıyı ID ile alma
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // ID'nin geçerli bir UUID formatında olup olmadığını kontrol et
        if (!userId) {
            res.status(400).json({
                data: null,
                error: 'User ID is required'
            });
            return;
        }

        // Kullanıcıyı ID ile bul
        const user = await User.findOne({ id: userId });

        // Kullanıcı bulunamazsa hata mesajı döndür
        if (!user) {
            res.status(404).json({
                data: null,
                error: 'User not found'
            });
            return;
        }

        // Başarılı şekilde kullanıcıyı döndür
        res.status(200).json({
            data: user,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};

// Tüm kullanıcıları listeleme
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password'); ;
        res.status(200).json({
            data: users,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
};

// Çoklu kullanıcıyı ID listesi ile silme
export const deleteUsersByIds = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIds = req.body.ids; // Silinecek kullanıcı ID'lerinin listesi

        // ID listesi boşsa hata mesajı döndür
        if (!userIds || userIds.length === 0) {
            res.status(400).json({
                data: null,
                error: 'User IDs are required'
            });
            return;
        }

        // Kullanıcıları ID listesi ile bul ve sil
        const deletedUsers = await User.deleteMany({ id: { $in: userIds } });

        // Silinen kullanıcı sayısı 0 ise hata mesajı döndür
        if (deletedUsers.deletedCount === 0) {
            res.status(404).json({
                data: null,
                error: 'No users found with the provided IDs'
            });
            return;
        }

        // Başarılı şekilde silinen kullanıcıların sayısını döndür
        res.status(200).json({
            data: {
                deletedCount: deletedUsers.deletedCount
            },
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};

// Kullanıcı girişi ve JWT oluşturma
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                data: null,
                error: 'Invalid credentials'
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({
                data: null,
                error: 'Invalid credentials'
            });
            return;
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({
            data: { token },
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: error
        });
    }
};


// Şifre sıfırlama
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Kullanıcıyı email ile bul
        const user = await User.findOne({ email });

        // Kullanıcı bulunamazsa hata mesajı döndür
        if (!user) {
            res.status(404).json({
                data: null,
                error: 'User not found'
            });
            return;
        }

        // Mevcut şifreyi doğrula
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        // Şifre doğrulanamazsa hata mesajı döndür
        if (!isPasswordValid) {
            res.status(400).json({
                data: null,
                error: 'Invalid current password'
            });
            return;
        }

        // Yeni şifreyi hash'le
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Kullanıcının şifresini güncelle
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            data: 'Password reset successful',
            error: null
        });
    } catch (error) {
        console.error('Error changing password:', error); // Hata ayıklama için loglama
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};