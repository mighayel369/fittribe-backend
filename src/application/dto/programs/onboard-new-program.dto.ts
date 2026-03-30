export interface OnboardProgramRequestDTO {
  name: string;
  description: string;
  programPic?: Express.Multer.File;
}

