export interface ModifyProgramSpecsRequestDTO {
  programId: string;
  name?: string;
  description?: string;
  file?: Express.Multer.File;
}