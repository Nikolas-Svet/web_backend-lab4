import {Request} from "express";

export type IRequestWithFile = Request & { file?: Express.Multer.File; user?: { userId: string } };