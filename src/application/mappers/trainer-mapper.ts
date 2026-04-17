import { TrainerEntity } from "domain/entities/TrainerEntity";
import { 
    TrainersResponseDTO, 
    ClientTrainersResponseDTO, 
    PendingTrainerResponseDTO 
} from "application/dto/trainer/fetch-all-trainers.dto";
import { 
    TrainerDetailsResponseDTO, 
    TrainerPrivateProfileDTO, 
    UserTrainerViewDTO 
} from "application/dto/trainer/fetch-trainer-details.dto";
import { TrainerApprovalResponseDTO } from "application/dto/trainer/trainer-approval.dto";
import { UpdateStatusResponseDTO } from "application/dto/common/update-status.dto";
import { APPROVAL_MESSAGES, TRAINER_STATUS_MESSAGES } from "utils/Constants";

export class TrainerMapper {

    static toTrainerResponseDTO(trainer: TrainerEntity): TrainersResponseDTO {
        return {
            trainerId: trainer.trainerId,
            name: trainer.name || "N/A",
            email: trainer.email || "",
            status: !!trainer.status, 
            pricePerSession: trainer.pricePerSession || 0
        };
    }

    static toClientTrainersResponseDTO(trainer: TrainerEntity): ClientTrainersResponseDTO {
        return {
            trainerId: trainer.trainerId,
            name: trainer.name || "N/A",
            email: trainer.email || "",
            status: !!trainer.status,
            pricePerSession: trainer.pricePerSession || 0,
            profilePic: trainer.profilePic || null,
            rating: trainer.rating || 0,
            experience: trainer.experience || 0,
            address: trainer.address || "NA",
            programs: (trainer.programs && trainer.programs.length > 0)
                ? (typeof trainer.programs[0] === 'string' ? trainer.programs[0] : (trainer.programs[0] as any).name)
                : "General Fitness"
        };
    }

    static toPendingTrainersResponseDTO(trainer: TrainerEntity): PendingTrainerResponseDTO {
        return {
            trainerId: trainer.trainerId,
            name: trainer.name || "N/A",
            pricePerSession: trainer.pricePerSession || 0,
            gender: trainer.gender || "Not Specified",
            programs: (trainer.programs || []).map(p => typeof p === 'string' ? p : (p as any).name)
        };
    }

    static toTrainerDetailsResponseDTO(trainer: TrainerEntity): TrainerDetailsResponseDTO {
        return {
            trainerId: trainer.trainerId,
            name: trainer.name || "N/A",
            email: trainer.email || "",
            status: trainer.status !== undefined ? !!trainer.status : true,
            profilePic: trainer.profilePic || "",
            pricePerSession: trainer.pricePerSession || 0,
            verified: trainer.verified,
            certificate: trainer.certificate || "",
            joined: trainer.createdAt ? trainer.createdAt.toISOString() : new Date().toISOString(),
            gender: trainer.gender || "Not Specified",
            programs: (trainer.programs || []).map((program: any) => ({
                programId: program.programId ? program.programId.toString() : "", 
                name: program.name || "General"
            })),
            role: trainer.role,
            experience: trainer.experience || 0,
            languages: trainer.languages || [],
            rejectReason: trainer.rejectReason || undefined,
            phone: trainer.phone || undefined
        };
    }

    static toTrainerPrivateProfileDTO(trainer: TrainerEntity): TrainerPrivateProfileDTO {
        const base = this.toTrainerDetailsResponseDTO(trainer);
        return {
            ...base,
            address: trainer.address || "NA",
            bio: trainer.bio || "",
        };
    }

    static toUserTrainerViewDTO(trainer: TrainerEntity): UserTrainerViewDTO {
        const base = this.toTrainerDetailsResponseDTO(trainer);
        return {
            ...base,
            address: trainer.address || "Global/Remote",
            bio: trainer.bio || "No bio added yet.",
            rating: trainer.rating || 0
        };
    }

    static toTrainerApprovalResponseDTO(trainer: TrainerEntity): TrainerApprovalResponseDTO {
        return {
            success: true,
            message: trainer.verified === "accepted" ? APPROVAL_MESSAGES.LOG_SUCCESS : APPROVAL_MESSAGES.LOG_REJECT,
            updatedStatus: (trainer.verified as "accepted" | "rejected") || "pending",
            trainerName: trainer.name || "Trainer"
        };
    }

    static toUpdateStatusResponseDTO(isActive: boolean): UpdateStatusResponseDTO {
        return {
            success: true,
            message: isActive ? TRAINER_STATUS_MESSAGES.UNBLOCK_SUCCESS : TRAINER_STATUS_MESSAGES.BLOCK_SUCCESS,
            newStatus: isActive
        };
    }
}