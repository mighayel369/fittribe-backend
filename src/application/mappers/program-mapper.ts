import { randomUUID } from "crypto";
import { ProgramEntity } from "domain/entities/ProgramEntity";
import { ToggleProgramVisibilityResponseDTO, ToggleProgramVisibilityResponseSchema } from "application/dto/management/programs-management/toggle-program-visibility.dto";
import { ProgramsSchema, ProgramsDTO } from "application/dto/discovery/public-programs.dto";
import { OnboardProgramBodyDTO } from "application/dto/management/programs-management/onboard-new-program.dto";
import { ProgramSummaryDTO, ProgramSummarySchema } from "application/dto/management/programs-management/program-summary.dto";
export class ProgramMapper {

  static toEntity(program: OnboardProgramBodyDTO, programPicture: string): ProgramEntity {
    return new ProgramEntity(
      randomUUID(),
      program.name,
      program.description,
      programPicture,
      true
    )
  }

  static toProgramSummaryDTO(entity: ProgramEntity): ProgramSummaryDTO {
    return ProgramSummarySchema.parse({
      programId: entity.programId,
      name: entity.name,
      description: entity.description,
      programPic: entity.programPic,
      isPublished: entity.status
    });
  }

  static toVisibilityResponseDTO(
    entity: ProgramEntity
  ): ToggleProgramVisibilityResponseDTO {

    return ToggleProgramVisibilityResponseSchema.parse({
      isPublished:
        entity.status
    });
  }


  static toExploreProgramsDTO(entity: ProgramEntity): ProgramsDTO {

    return ProgramsSchema.parse({
      programId: entity.programId,
      name: entity.name,
      description: entity.description,
      programPic: entity.programPic
    });
  }
}