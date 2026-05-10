import { inject, injectable } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { IExplorePrograms } from "application/interfaces/program/i-explore-programs";
import { ProgramMapper } from "application/mappers/program-mapper";
import { ExploreProgramsResponseDTO } from "application/dto/programs/program-summary.dto";

@injectable()
export class ExplorePrograms implements IExplorePrograms {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN)
    private readonly _programRepository: IProgramRepo
  ) { }

  async execute(): Promise<ExploreProgramsResponseDTO> {
    const publishedPrograms = await this._programRepository.findPublishedPrograms();
    const mappedPrograms = publishedPrograms.map((program) =>
      ProgramMapper.toExploreProgramsDTO(program)
    );

    return {
      data: mappedPrograms
    };

  }
}