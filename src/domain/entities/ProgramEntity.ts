import { AppError } from "domain/errors/AppError";
export class ProgramEntity {
  constructor(
    public programId: string,
    public name: string,
    public description: string,
    public programPic: string,
    public status = true,
    public isArchived = false
  ) { }

  public validateProgram(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new AppError("Program name must be at least 3 characters long.");
    }
    if (!this.description || this.description.length < 10) {
      throw new AppError("Description is too short to be helpful for users.");
    }
  }


  public updateSpecifications(name?: string, description?: string, pic?: string): void {
    if (name) this.name = name;
    if (description) this.description = description;
    if (pic) this.programPic = pic;

    this.validateProgram();
  }
}