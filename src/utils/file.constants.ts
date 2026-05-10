
import { Response } from 'express';
import { FILE_CONSTANTS } from './Constants';
import { HttpStatus } from './HttpStatus';
export class FileResponseHelper {
    static sendPdf(res: Response, buffer: Buffer, baseName: string): void {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `${baseName}-${date}.pdf`;

        res.setHeader('Content-Type', FILE_CONSTANTS.PDF_MIME_TYPE);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(HttpStatus.OK).send(buffer);
    }
}