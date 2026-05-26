import { TrainerProfileDTO } from "application/dto/account/trainer/get-trainer-profile.dto";
import { TrainerProfileAggregate } from "domain/repositories/types/trainer-aggregate.type";
import { TrainerProfileSchema } from "application/dto/account/trainer/get-trainer-profile.dto";
import { ClientTrainerSchema, ClientTrainersResponseDTO } from "application/dto/discovery/public-trainers.dto";
import { TrainerRegisterRequestDTO } from "application/dto/auth/trainer/trainer.register.dto";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { randomUUID } from "crypto";
import { UserRole } from "domain/constants/user-role";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { UserTrainerViewDTO } from "application/dto/discovery/public-trainer-details.dto";
import { TrainersResponseDTO, TrainersResponseSchema } from "application/dto/management/trainer-management/all-trainers.dto";
import { PendingTrainerResponseDTO, PendingTrainerResponseSchema } from "application/dto/management/trainer-management/pending-trainers.dto";
import { AdminTrainerDetailsSchema, AdminTrainerDetailsDTO } from "application/dto/management/trainer-management/trainer-details.dto";
export const TrainerMapper = {
    toTrainerProfile(trainer: TrainerProfileAggregate): TrainerProfileDTO {

        return TrainerProfileSchema.parse({
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            phone: trainer.phone ?? "Not Provided",
            gender: trainer.gender,
            address: trainer.address ?? "",
            bio: trainer.bio ?? "",
            profilePic: trainer.profilePic ?? "",
            experience: trainer.experience,
            languages: trainer.languages ?? [],
            pricePerSession: trainer.pricePerSession,
            status: trainer.status,
            verified: trainer.verified,
            rejectReason: trainer.rejectReason ?? "",
            certificate: trainer.certificate ?? "",
            rating: trainer.rating ?? 0,
            joined: trainer.createdAt
                ? trainer.createdAt.toLocaleDateString()
                : "",
            programs: trainer.programs.map(program => ({
                programId: program.programId,
                name: program.name,
                description: program.description,
                image: program.programPic
            }))
        });
    },

    toTrainerEntity(
        data: TrainerRegisterRequestDTO,
        hashedPassword: string,
        certificateUrl?: string
    ): TrainerEntity {

        return new TrainerEntity(
            randomUUID(),
            data.name,
            data.email,
            UserRole.TRAINER,
            TRAINER_STATUS.PENDING,
            data.pricePerSession,
            hashedPassword,
            data.languages,
            data.experience,
            data.programs,
            certificateUrl || null,
            data.gender
        );
    },

    toClientTrainerDTO(
        trainer: TrainerProfileAggregate
    ): ClientTrainersResponseDTO {


        return ClientTrainerSchema.parse({
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            status: trainer.status,
            pricePerSession: trainer.pricePerSession,
            profilePic: trainer.profilePic || null,
            rating: trainer.rating || 0,
            experience: trainer.experience || 0,
            address: trainer.address || null,
            programs: trainer.programs.map(p => p.name)
        });
    },

    toUserTrainerView(trainer: TrainerProfileAggregate, chatId: string | null): UserTrainerViewDTO {


        return {
            trainerId: trainer.trainerId,
            name: trainer.name,
            profilePic: trainer.profilePic || "",
            pricePerSession: trainer.pricePerSession,
            experience: trainer.experience,
            languages: trainer.languages || [],
            address: trainer.address || "",
            bio: trainer.bio || "",
            rating: trainer.rating || 0,
            chatId: chatId,
            programs: trainer.programs.map(p => ({
                programId: p.programId,
                name: p.name,
                description: p.description,
                image: p.programPic
            }))
        };
    },

    toTrainersResponseDTO(trainer: TrainerProfileAggregate): TrainersResponseDTO {

        return TrainersResponseSchema.parse({
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            status: trainer.status,
            pricePerSession: trainer.pricePerSession
        })
    },

    toPendingTrainerDTO(
        trainer: TrainerProfileAggregate
    ): PendingTrainerResponseDTO {

        return PendingTrainerResponseSchema.parse({
            trainerId: trainer.trainerId,
            name: trainer.name,
            pricePerSession: trainer.pricePerSession,
            gender: trainer.gender,
            programs: trainer.programs.map(p => p.name)
        });
    },

    toAdminTrainerDetails(
        trainer: TrainerProfileAggregate
    ): AdminTrainerDetailsDTO {

        return AdminTrainerDetailsSchema.parse({
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            role: trainer.role,
            profilePic: trainer.profilePic || null,
            gender: trainer.gender,
            experience: trainer.experience,
            languages: trainer.languages || [],
            pricePerSession: trainer.pricePerSession,
            certificate: trainer.certificate || "",
            verified: trainer.verified,
            status: trainer.status,
            joined: trainer.createdAt
                ? new Date(trainer.createdAt).toISOString()
                : new Date().toISOString(),
            rejectReason: trainer.rejectReason || "",
            programs: trainer.programs.map(p => ({
                programId: p.programId, name: p.name, description: p.description, image: p.programPic
            }))
        });
    }
};