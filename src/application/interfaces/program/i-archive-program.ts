export const I_ARCHIVE_PROGRAM_TOKEN = Symbol("I_ARCHIVE_PROGRAM_TOKEN");
export interface IArchiveProgram {
    execute(programId: string): Promise<void>;
}