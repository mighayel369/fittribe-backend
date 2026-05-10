import { ClientTrainersResponseDTO, PendingTrainerResponseDTO, TrainersResponseDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { AdminTrainerDetails, TrainerPrivateProfileDTO, UserTrainerViewDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { TrainerType } from "domain/repositories/types/trainer-type";


export const TrainerMapper = {
    toTrainerProfile(data: TrainerType): TrainerPrivateProfileDTO {
        const { trainer } = data
        return {
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            phone: trainer.phone || "Not Provided",
            gender: trainer.gender,
            address: trainer.address || "",
            bio: trainer.bio || "",
            profilePic: trainer.profilePic || "",
            experience: trainer.experience,
            languages: trainer.languages || [],
            pricePerSession: trainer.pricePerSession,
            status: trainer.status,
            verified: trainer.verified,
            rejectReason: trainer.rejectReason || "",
            certificate: trainer.certificate || "",
            rating: trainer.rating || 0,
            joined: trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString() : "",
            programs: trainer.programs.map(p => ({
                programId: p.programId,
                name: p.name,
                description: p.description,
                image: p.programPic
            }))
        };
    },

    toClientTrainerDTO(data: TrainerType): ClientTrainersResponseDTO {
        const { trainer } = data;

        return {
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            status: trainer.status,
            pricePerSession: trainer.pricePerSession,
            profilePic: trainer.profilePic || null,
            rating: trainer.rating || 0,
            experience: trainer.experience || 0,
            address: trainer.address || null,

            programs: trainer.programs.map(p => p.name).join(", ") || "General Training"
        };
    },

    toUserTrainerView(data: TrainerType, chatId: string | null): UserTrainerViewDTO {
        const { trainer } = data;

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

    toTrainersResponseDTO(data: TrainerType): TrainersResponseDTO {
        const { trainer } = data;

        return {
            trainerId: trainer.trainerId,
            name: trainer.name,
            email: trainer.email,
            status: trainer.status,
            pricePerSession: trainer.pricePerSession
        };
    },

    toPendingTrainerDTO(data: TrainerType): PendingTrainerResponseDTO {
        const { trainer } = data;

        return {
            trainerId: trainer.trainerId,
            name: trainer.name,
            pricePerSession: trainer.pricePerSession,
            gender: trainer.gender,
            programs: trainer.programs.map(p => p.name)
        };
    },

    toAdminTrainerDetails(data: TrainerType): AdminTrainerDetails {
        const { trainer } = data;

        return {
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
            joined: trainer.createdAt ? new Date(trainer.createdAt).toISOString() : new Date().toISOString(),
            rejectReason: trainer.rejectReason || "",
            programs: trainer.programs.map(p => ({
                programId: p.programId,
                name: p.name,
                description: p.description,
                image: p.programPic
            }))
        };
    }
};