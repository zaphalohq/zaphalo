import { Injectable } from "@nestjs/common";
import { unlinkSync } from "fs";

@Injectable()
export class FileUploadService {
    constructor(
    ) { }

    async handleFileUpload(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }
        const baseUrl = `${process.env.SERVER_URL}`;
        const fileUrl = `${baseUrl}/${file.filename}`;
        return fileUrl;
    }

    async deleteFile(filename: string): Promise<void> {
        try {
            unlinkSync(`uploads\\${filename}`);
        } catch (error) {
            throw new Error("Failed to delete file: ${error.message}");
        }
    }
}