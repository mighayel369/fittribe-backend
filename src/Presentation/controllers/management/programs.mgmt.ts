import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ONBOARD_NEW_PROGRAM_TOKEN, IOnboardNewProgram } from 'application/interfaces/program/i-onboard-new-program';
import { OnboardProgramRequestDTO } from 'application/dto/programs/onboard-new-program.dto';
import { I_FETCH_PROGRAM_INVENTORY_TOKEN, IFetchProgramInventory } from 'application/interfaces/program/i-fetch-program-summary';
import { FetchProgramInventoryRequestDTO, FetchProgramInventoryResponseDTO } from 'application/dto/programs/program-summary.dto';
import { I_MODIFY_PROGRAM_SPECS_TOKEN, IModifyProgramSpecs } from 'application/interfaces/program/i-modify-program-specs';
import { ModifyProgramSpecsRequestDTO } from 'application/dto/programs/modify-program-sepcs.dto';
import { I_ARCHIVE_PROGRAM_TOKEN, IArchiveProgram } from 'application/interfaces/program/i-archive-program';
import { I_TOGGLE_PROGRAM_VISIBILITY_TOKEN, IToggleProgramVisibility } from 'application/interfaces/program/i-toggle-program-visibility';
import { ToggleProgramVisibilityRequestDTO } from 'application/dto/programs/toggle-program-visibility.dto';
import { ProgramDetailsResponseDTO } from 'application/dto/programs/program-details.dto';
import { I_FETCH_PROGRAM_DETAILS_TOKEN, IFetchProgramDetails } from 'application/interfaces/program/i-program-details';
import { PAGINATION } from 'utils/Constants';
import { ProgramParams } from 'Presentation/interfaces/request.params';
@injectable()
export class ProgramsManagementController {
    constructor(
        @inject(I_TOGGLE_PROGRAM_VISIBILITY_TOKEN)
        private readonly _toggleVisibilityUseCase: IToggleProgramVisibility,

        @inject(I_ONBOARD_NEW_PROGRAM_TOKEN)
        private readonly _onboardProgramUseCase: IOnboardNewProgram,

        @inject(I_ARCHIVE_PROGRAM_TOKEN)
        private readonly _archiveProgramUseCase: IArchiveProgram,

        @inject(I_FETCH_PROGRAM_INVENTORY_TOKEN)
        private readonly _fetchInventoryUseCase: IFetchProgramInventory,

        @inject(I_MODIFY_PROGRAM_SPECS_TOKEN)
        private readonly _modifyProgramUseCase: IModifyProgramSpecs,

        @inject(I_FETCH_PROGRAM_DETAILS_TOKEN)
        private readonly _getDetailsUseCase: IFetchProgramDetails,
    ) { }

    onboardNewProgram = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const onboardPayload: OnboardProgramRequestDTO = {
                ...req.body,
                programPic: req.file
            };

            await this._onboardProgramUseCase.execute(onboardPayload);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.ONBOARD_NEW_PROGRAM,
            });
        } catch (err) {
            next(err);
        }
    };

    getAdminProgramInventory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit, pageNo, search } = req.query;


            const searchStr = typeof search === 'string' ? search : "";


            const rawLimit = typeof limit === 'string' ? parseInt(limit, 10) : PAGINATION.DEFAULT_LIMIT;
            const safeLimit = (isNaN(rawLimit) || rawLimit <= 0) ? PAGINATION.DEFAULT_LIMIT : rawLimit;

            const rawPage = typeof pageNo === 'string' ? parseInt(pageNo, 10) : 1;
            const currentPage = (isNaN(rawPage) || rawPage <= 0) ? 1 : rawPage;

            const inventoryPayload: FetchProgramInventoryRequestDTO = {
                limit: safeLimit,
                currentPage: currentPage,
                filter: {
                    search: searchStr
                }
            };

            const inventoryResult: FetchProgramInventoryResponseDTO =
                await this._fetchInventoryUseCase.execute(inventoryPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.FETCHED_ALL_PROGRAMS,
                programs: inventoryResult
            });
        } catch (error) {
            next(error);
        }
    };

    modifyProgramSpecifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, programId } = req.body;

            const updatePayload: ModifyProgramSpecsRequestDTO = {
                programId,
                name,
                description,
                file: req.file
            };

            await this._modifyProgramUseCase.execute(updatePayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.PROGRAM_UPDATED
            });
        } catch (err) {
            next(err);
        }
    };

    archiveProgram = async (req: Request<ProgramParams>, res: Response, next: NextFunction) => {
        try {
            const { programId } = req.params;
            if (!programId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._archiveProgramUseCase.execute(programId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.PROGRAM_ARCHIEVED
            });
        } catch (err) {
            next(err);
        }
    }

    toggleProgramVisibility = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { status, programId } = req.body;

            const visibilityPayload: ToggleProgramVisibilityRequestDTO = {
                programId,
                isPublished: status
            };

            const visibilityResult = await this._toggleVisibilityUseCase.execute(visibilityPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.PROGRAM_STATUS_UPDATED(visibilityResult.isPublished),
                status: visibilityResult.isPublished
            });
        } catch (error) {
            next(error);
        }
    };

    getProgramFullDetails = async (req: Request<ProgramParams>, res: Response, next: NextFunction) => {
        try {
            const { programId } = req.params;

            if (!programId) {
                throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
            }

            const programDetails: ProgramDetailsResponseDTO = await this._getDetailsUseCase.execute(programId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PROGRAMS.PROGRAM_DETAILS_FETCHED,
                program: programDetails
            });
        } catch (error) {
            next(error);
        }
    };
}