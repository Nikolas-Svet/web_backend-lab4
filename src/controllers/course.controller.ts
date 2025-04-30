// src/controllers/course.controller.ts
import { Request, Response } from 'express';
import { ErrorMessages } from '../utils/consts';
import Course from '../models/course.model';
import mongoose from "mongoose";
import slugify from 'slugify';
import {processImage} from "../utils/image.utils";
import {IRequestWithFile} from "../types/course.types";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: string[] = await Course.distinct('category');
        res.json({ categories });
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const createCourse = async (req: IRequestWithFile, res: Response) => {
    try {
        const { title, description, price, category, level, published, tags } = req.body;
        const author = req.user?.userId;
        if (!author) {
            res.status(401).json({ message: ErrorMessages.GetInfoNotAuth });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: ErrorMessages.CourseNotFile });
            return;
        }

        const processedImage = await processImage(req.file.path);

        const course = new Course({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            description,
            price,
            image: processedImage,
            category,
            level,
            published,
            author,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
            createdAt: new Date(),
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Ошибка создания курса:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const getCourses = async (req: IRequestWithFile, res: Response) => {
    try {
        const {
            title,
            category,
            level,
            published,
            priceMin,
            priceMax,
            tags,
            sort = '-createdAt',
            page = '1',
            limit = '10',
        } = req.query;

        const filter: any = {};
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (published !== undefined) filter.published = published === 'true';
        if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : (tags as string).split(',') };
        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = Number(priceMin);
            if (priceMax) filter.price.$lte = Number(priceMax);
        }

        const sortBy: any = {};
        (sort as string).split(',').forEach(field => {
            const dir = field.startsWith('-') ? -1 : 1;
            const key = field.replace(/^[-+]/, '');
            sortBy[key] = dir;
        });

        const currentPage = parseInt(page as string, 10);
        const perPage = parseInt(limit as string, 10);
        const skip = (currentPage - 1) * perPage;

        const [courses, total] = await Promise.all([
            Course.find(filter).sort(sortBy).skip(skip).limit(perPage),
            Course.countDocuments(filter),
        ]);

        res.json({
            total,
            page: currentPage,
            pages: Math.ceil(total / perPage),
            data: courses,
        });
    } catch (error) {
        console.error('Ошибка получения курсов:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const getCourseById = async (req: IRequestWithFile, res: Response) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: ErrorMessages.ValidationId });
            return;
        }
        const course = await Course.findById(id).select('-__v');
        if (!course) {
            res.status(404).json({ message: ErrorMessages.NotFoundCourse });
            return;
        }
        res.json(course);
    } catch (error) {
        console.error('Ошибка получения курса:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const updateCourseById = async (req: IRequestWithFile, res: Response) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: ErrorMessages.ValidationId });
            return;
        }

        const updates: any = { ...req.body };
        if (updates.title) {
            updates.slug = slugify(updates.title, { lower: true, strict: true });
        }
        if (req.file) {
            updates.image = await processImage(req.file.path);
        }

        const updated = await Course.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json({ message: ErrorMessages.NotFoundCourse });
            return;
        }
        res.json(updated);
    } catch (error) {
        console.error('Ошибка обновления курса:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};

export const deleteCourseById = async (req: IRequestWithFile, res: Response) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: ErrorMessages.ValidationId });
            return;
        }

        const deleted = await Course.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: ErrorMessages.NotFoundCourse });
            return;
        }
        res.status(200).json({ message: ErrorMessages.CourseDelSuccessful });
    } catch (error) {
        console.error('Ошибка удаления курса:', error);
        res.status(500).json({ message: ErrorMessages.InternalServerError });
    }
};