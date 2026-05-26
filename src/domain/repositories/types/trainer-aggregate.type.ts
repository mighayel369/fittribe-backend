import { ProgramEntity } from "domain/entities/ProgramEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";


export interface TrainerProfileAggregate
  extends Omit<TrainerEntity, "programs"> {
  programs: ProgramEntity[];
}