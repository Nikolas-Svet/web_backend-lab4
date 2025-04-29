// src/utils/image.utils.ts

import sharp from 'sharp';

export const processImage = async (filePath: string) => {
    const outputPath = filePath.replace(/(\.[\w\d_-]+)$/i, '_processed$1');

    await sharp(filePath)
        .resize(800)
        .toFile(outputPath);

    return outputPath;
};