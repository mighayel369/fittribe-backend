import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { HttpStatus } from "utils/HttpStatus";

type Location = "body" | "query" | "params";

export const validateRequest = (schema: ZodType<any>, location: Location = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        const target = req[location];
        console.log(target)
        const result = schema.safeParse(target);
        if (!result.success) {
            const errorMessages = result.error.issues.map((err) => err.message);
            console.log(errorMessages)
            res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: errorMessages[0].split(":")[0] || errorMessages[0] || errorMessages });
            return;
        };

        Object.assign(req[location], result.data);
        next();
    };