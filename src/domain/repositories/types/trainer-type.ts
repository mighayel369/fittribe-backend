import { ProgramEntity } from "domain/entities/ProgramEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";


export interface TrainerType {
  trainer: Omit<TrainerEntity, "programs"> & {
    programs: ProgramEntity[];
  };
}