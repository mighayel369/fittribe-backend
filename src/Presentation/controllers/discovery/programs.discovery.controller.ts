import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_EXPLORE_PROGRAMS_TOKEN, IExplorePrograms } from 'application/interfaces/program/i-explore-programs';
import { ExploreProgramsResponseDTO } from 'application/dto/programs/program-summary.dto';
@injectable()
export class ProgramsDiscoveryController {
    constructor(
        @inject(I_EXPLORE_PROGRAMS_TOKEN) private _explorePrograms: IExplorePrograms,
    ) { }

    exploreActivePrograms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: ExploreProgramsResponseDTO = await this._explorePrograms.execute();
            console.log(result)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Active programs discovered",
                program: result
            });
        } catch (err) {
            next(err);
        }
    }
}