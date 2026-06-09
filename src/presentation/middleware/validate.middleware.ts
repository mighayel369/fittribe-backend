import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { HttpStatus } from "utils/HttpStatus";

type Location = "body" | "query" | "params" | "user" | "file";

export const validateRequest = <T>(schema: ZodType<T>, location: Location = "body") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const target = req[location];

            if (location === "file" && !target) {
                return next();
            }

            const result = schema.safeParse(target);

            if (!result.success) {
                const errorMessages = result.error.issues.map((err) => err.message);
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: errorMessages[0]
                });
                return;
            }

            Object.defineProperty(req, location, {
                value: result.data,
                writable: true,
                configurable: true,
                enumerable: true
            });

            next();
        } catch (err) {
            next(err);
        }
    };
};