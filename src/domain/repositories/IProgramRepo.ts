import { ProgramEntity } from "domain/entities/ProgramEntity";
import { IProgramFilters } from "domain/filters/IProgramFilters";

export const I_PROGRAM_REPO_TOKEN = Symbol("I_PROGRAM_REPO_TOKEN");

export interface IProgramRepo {
  saveProgram(payload: ProgramEntity): Promise<void>;

  findProgramInventory(
    page: number,
    limit: number,
    filters: IProgramFilters
  ): Promise<{ data: ProgramEntity[]; totalCount: number }>;

  findProgramById(id: string): Promise<ProgramEntity | null>;

  updateProgramSpecs(data: Partial<ProgramEntity>): Promise<ProgramEntity | null>;

  updateProgramVisibility(programId: string, status: boolean): Promise<ProgramEntity | null>;

  archiveProgram(programId: string): Promise<void>;

  findPublishedPrograms(): Promise<ProgramEntity[]>;
}