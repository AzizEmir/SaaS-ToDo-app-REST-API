import { Request, Response } from 'express';
import Task from '../models/Task';

// Task oluşturma
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body); // Debugging

        const { title, description } = req.body;
        const userId = (req as any).user.id; // JWT'den gelen kullanıcı ID'si

        const newTask = new Task({
            title,
            description,
            userId
        });

        const savedTask = await newTask.save();
        res.status(201).json({
            data: savedTask,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};

// Task listeleme
export const listTasks = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = (req as any).user.id; // JWT'den gelen kullanıcı ID'si

        const tasks = await Task.find({ userId });
        res.status(200).json({
            data: tasks,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};

// çoklu veya tekli Task silme
export const deleteTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body); // Debugging

        const { ids } = req.body;
        const userId = (req as any).user?.id; // JWT'dan kullanıcı id'sini al

        // IDs kontrolü
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({
                data: null,
                error: 'Invalid request: no IDs provided'
            });
            return;
        }

        // Kullanıcının silme yetkisini kontrol et
        const tasks = await Task.find({ id: { $in: ids }, userId });

        if (tasks.length !== ids.length) {
            res.status(403).json({
                data: null,
                error: 'You can only delete your own tasks'
            });
            return;
        }

        // Görevleri sil
        const result = await Task.deleteMany({ id: { $in: ids }, userId });

        if (result.deletedCount === 0) {
            res.status(404).json({
                data: null,
                error: 'No tasks found to delete'
            });
            return;
        }

        res.status(200).json({
            data: { deletedCount: result.deletedCount },
            error: null
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal Server Error'
        });
    }
};
