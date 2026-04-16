import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_ONBOARD_NEW_PROGRAM_TOKEN, IOnboardNewProgram } from 'application/interfaces/program/i-onboard-new-program';
import { OnboardProgramRequestDTO } from 'application/dto/programs/onboard-new-program.dto';
import { I_FETCH_PROGRAM_INVENTORY_TOKEN, IFetchProgramInventory } from 'application/interfaces/program/i-fetch-program-summary';
import { FetchProgramInventoryRequestDTO, FetchProgramInventoryResponseDTO } from 'application/dto/programs/program-summary.dto';
import { I_MODIFY_PROGRAM_SPECS_TOKEN, IModifyProgramSpecs } from 'application/interfaces/program/i-modify-program-specs';
import { ModifyProgramSpecsRequestDTO } from 'application/dto/programs/modify-program-sepcs.dto';
import { I_ARCHIVE_PROGRAM_TOKEN, IArchiveProgram } from 'application/interfaces/program/i-archive-program';
import { I_TOGGLE_PROGRAM_VISIBILITY_TOKEN, IToggleProgramVisibility } from 'application/interfaces/program/i-toggle-program-visibility';
import { ToggleProgramVisibilityRequestDTO, ToggleProgramVisibilityResponseDTO } from 'application/dto/programs/toggle-program-visibility.dto';
import { ProgramDetailsResponseDTO } from 'application/dto/programs/program-details.dto';
import { I_FETCH_PROGRAM_DETAILS_TOKEN, IFetchProgramDetails } from 'application/interfaces/program/i-program-details';
import { PAGINATION } from 'utils/Constants';
@injectable()
export class ProgramsManagementController {
    constructor(
        @inject(I_TOGGLE_PROGRAM_VISIBILITY_TOKEN) private _toggleVisibility: IToggleProgramVisibility,
        @inject(I_ONBOARD_NEW_PROGRAM_TOKEN) private _onboardProgram: IOnboardNewProgram,
        @inject(I_ARCHIVE_PROGRAM_TOKEN) private _archiveProgram: IArchiveProgram,
        @inject(I_FETCH_PROGRAM_INVENTORY_TOKEN) private _fetchInventory: IFetchProgramInventory,
        @inject(I_MODIFY_PROGRAM_SPECS_TOKEN) private _modifyProgram: IModifyProgramSpecs,
        @inject(I_FETCH_PROGRAM_DETAILS_TOKEN) private _getDetails: IFetchProgramDetails,
    ) { }
    onboardNewProgram = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: OnboardProgramRequestDTO = {
                ...req.body,
                programPic: req.file
            };

            await this._onboardProgram.execute(input);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Fitness program onboarded successfully",
            });
        } catch (err) { next(err); }
    };

    getAdminProgramInventory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: FetchProgramInventoryRequestDTO = {
                searchQuery: (req.query.search as string) || "",
                limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                filter: {}
            };

            const result: FetchProgramInventoryResponseDTO = await this._fetchInventory.execute(input);
            console.log(result)
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Program inventory retrieved",
                programs: result
            });
        } catch (error) {
            next(error);
        }
    };

    modifyProgramSpecifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name, description, duration } = req.body;

            if (!id) throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

            const updateDto: ModifyProgramSpecsRequestDTO = {
                programId: id,
                name,
                description,
                file: req.file
            };

            await this._modifyProgram.execute(updateDto);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Program specifications updated"
            });
        } catch (err) {
            next(err);
        }
    };

    archiveProgram = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);

            await this._archiveProgram.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Program has been archived",
            });
        } catch (err) {
            next(err);
        }
    }

    toggleProgramVisibility = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const payload: ToggleProgramVisibilityRequestDTO = { programId: id, isPublished: status };
            const response = await this._toggleVisibility.execute(payload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: `Program is now ${response.isPublished ? 'Published' : 'Hidden'}`,
                status: response.isPublished
            });
        } catch (error) { next(error); }
    };
    getProgramFullDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

            const programData: ProgramDetailsResponseDTO = await this._getDetails.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Program details retrieved",
                program: programData
            });
        } catch (error) {
            next(error);
        }
    };
}