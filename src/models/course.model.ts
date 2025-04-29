// src/models/course.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICourse extends Document {
    title: string;
    slug: string;
    description?: string;
    price: number;
    image: string;
    category: string;
    level: string;
    published: boolean;
    author: string;
    createdAt: string;
    tags: string[];
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    level: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner', required: true },
    category: { type: String, required: true },
    published: { type: Boolean, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true },
})

CourseSchema.pre<ICourse>('validate', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default  mongoose.model<ICourse>('Course', CourseSchema);
