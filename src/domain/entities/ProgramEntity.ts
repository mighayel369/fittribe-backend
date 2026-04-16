export class ProgramEntity {
  constructor(
    public programId: string,
    public name: string,
    public description: string,
    public programPic: string,  
    public status?: boolean,
    public isArchived?: boolean
  ) {
    this.validate();
  }

  public validate(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new Error("Program name must be at least 3 characters long.");
    }
    if (!this.description || this.description.length < 10) {
      throw new Error("Description is too short to be helpful for users.");
    }
  }


  public updateSpecifications(name?: string, description?: string, pic?: string): void {
    if (name) this.name = name;
    if (description) this.description = description;
    if (pic) this.programPic = pic;

    this.validate();
  }
}