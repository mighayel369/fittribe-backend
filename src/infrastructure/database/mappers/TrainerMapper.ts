
import { ProgramMapper } from "./ProgramMapper";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ITrainer } from "../models/TrainerModel";
import { ProgramEntity } from "domain/entities/ProgramEntity";
export const TrainerMapper = {
  toEntity(doc: ITrainer): TrainerEntity {
    if (!doc) return null as any;

    return new TrainerEntity(
      doc.trainerId,
      doc.name,
      doc.email,
      doc.role,
      doc.verified as any,
      doc.pricePerSession,
      doc.password || null,
      doc.languages || [],
      doc.experience || 0,
      Array.isArray(doc.programs)
        ? doc.programs.map((p: any) => 
            typeof p === 'object' && p.name 
              ? ProgramMapper.toEntity(p) 
              : p 
          )
        : [],
      doc.certificate || null,
      doc.gender || "other",
      doc.rating || 0,
      doc.reviewCount || 0, 
      doc.status,
      doc.createdAt,
      doc.bio || null,
      doc.phone || null,
      doc.address || null,
      doc.rejectReason || null,
      doc.profilePic || null
    );
  },

  toPersistence(entity: TrainerEntity): Partial<ITrainer> {
    return {
      trainerId: entity.trainerId,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      verified: entity.verified as any,
      pricePerSession: entity.pricePerSession,
      password: entity.password || undefined,
      languages: entity.languages,
      experience: entity.experience,
      programs: entity.programs.map((p) => 
        typeof p === 'string' ? p : (p as ProgramEntity).programId
      ),
      certificate: entity.certificate || undefined,
      gender: entity.gender,
      rating: entity.rating,
      reviewCount: entity.reviewCount,
      status: entity.status,
      bio: entity.bio || undefined,
      phone: entity.phone || undefined,
      address: entity.address || undefined,
      rejectReason: entity.rejectReason || undefined,
      profilePic: entity.profilePic || undefined
    };
  }
};