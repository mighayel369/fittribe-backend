import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_EXPLORE_PROGRAMS_TOKEN, IExplorePrograms } from 'application/interfaces/program/i-explore-programs';
import { ExploreProgramsResponseDTO } from 'application/dto/programs/program-summary.dto';
@injectable()
export class ProgramsDiscoveryController {
    constructor(
        @inject(I_EXPLORE_PROGRAMS_TOKEN)
        private readonly _exploreProgramsUseCase: IExplorePrograms,
    ) { }

    exploreActivePrograms = async (_req: Request, res: Response, next: NextFunction) => {
        try {

            const activePrograms: ExploreProgramsResponseDTO = await this._exploreProgramsUseCase.execute();
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.ACTIVE_PROGRAMS_FETCHED,
                data: activePrograms
            });
        } catch (err) {
            next(err);
        }
    }
}