import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { HttpStatus } from "utils/HttpStatus";

type Location = "body" | "query" | "params" | "user";

export const validateRequest = (schema: ZodType<unknown>, location: Location = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        const target = req[location];

        const result = schema.safeParse(target);
        if (!result.success) {
            const errorMessages = result.error.issues.map((err) => err.message);

            res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: errorMessages[0].split(":")[0] || errorMessages[0] || errorMessages });
            return;
        };

        Object.assign(req[location], result.data);
        next();
    };