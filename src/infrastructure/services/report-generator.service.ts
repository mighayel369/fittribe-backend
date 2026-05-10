
import { AppError } from 'domain/errors/AppError';
import PDFDocument from 'pdfkit';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import logger from 'utils/logger';
export interface PdfTableConfig<T> {
  title: string;
  subtitle?: string;
  headers: string[];
  columnWidths: number[];
  rows: T[];
  rowMapper: (row: T) => string[];
}
export class ReportGeneratorService {
  static async toPdf<T>(config: PdfTableConfig<T>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        doc.fillColor('#2c3e50').fontSize(20).font('Helvetica-Bold').text(config.title, { align: 'center' });
        if (config.subtitle) {
          doc.moveDown(0.5).fontSize(10).font('Helvetica').fillColor('#7f8c8d').text(config.subtitle, { align: 'center' });
        }
        doc.moveDown(2);


        const startX = 50;
        let currentY = doc.y;

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#2c3e50');
        config.headers.forEach((header, i) => {
          const xPos = startX + config.columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.text(header.toUpperCase(), xPos, currentY);
        });

        currentY += 20;
        doc.strokeColor('#dee2e6').lineWidth(1).moveTo(startX, currentY - 5).lineTo(550, currentY - 5).stroke();


        doc.font('Helvetica').fontSize(9).fillColor('#333');
        config.rows.forEach((row) => {

          if (currentY > 750) {
            doc.addPage();
            currentY = 50;
          }

          const cells = config.rowMapper(row);
          cells.forEach((cell, i) => {
            const xPos = startX + config.columnWidths.slice(0, i).reduce((a, b) => a + b, 0);


            if (i === 0) doc.font('Helvetica-Bold');
            else doc.font('Helvetica');

            doc.text(cell || "N/A", xPos, currentY, {
              width: config.columnWidths[i] - 10,
              ellipsis: true
            });
          });

          currentY += 25;
          doc.strokeColor('#f1f3f5').lineWidth(0.5).moveTo(startX, currentY - 5).lineTo(550, currentY - 5).stroke();
        });


        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#adb5bd').text(
            `FitTribe Internal Confidential - Page ${i + 1} of ${pageCount}`,
            50,
            780,
            { align: 'center' }
          );
        }

        doc.end();
      } catch (error) {
        logger.error("Failed to generate PDF report:", error);
        reject(new AppError(ERROR_MESSAGES.PDF_GENERATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR));
      }
    });
  }
}