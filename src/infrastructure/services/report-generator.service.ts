
import { AppError } from 'domain/errors/AppError';
import { Parser, Options } from 'json2csv';
import PDFDocument from 'pdfkit';
export interface PdfTableConfig {
    title: string;
    subtitle?: string;
    headers: string[];
    columnWidths: number[];
    rows: string[][];
}
export class ReportGeneratorService {
static async toPdf(config: PdfTableConfig): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', (err) => reject(err));

                doc.fontSize(20).font('Helvetica-Bold').text(config.title, { align: 'center' });
                if (config.subtitle) {
                    doc.fontSize(10).font('Helvetica').fillColor('#666').text(config.subtitle, { align: 'center' });
                }
                doc.moveDown(2);

                const startX = 50;
                let currentY = doc.y;

                doc.fontSize(10).font('Helvetica-Bold').fillColor('#000');
                config.headers.forEach((header, i) => {
                    const xPos = startX + config.columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                    doc.text(header, xPos, currentY);
                });

                currentY += 20;
                doc.moveTo(startX, currentY - 5).lineTo(550, currentY - 5).stroke();

                doc.font('Helvetica').fontSize(9);
                config.rows.forEach((row) => {
                    if (currentY > 750) {
                        doc.addPage();
                        currentY = 50;
                    }

                    row.forEach((cell, i) => {
                        const xPos = startX + config.columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                        doc.text(cell || '', xPos, currentY, {
                            width: config.columnWidths[i],
                            ellipsis: true
                        });
                    });

                    currentY += 20;
                });

                doc.end();
            } catch (error) {
                console.error("Generic PDF Error:", error);
                reject(new AppError("Failed to generate PDF report"));
            }
        });
    }
}