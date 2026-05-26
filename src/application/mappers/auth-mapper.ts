import { LoginResponseDTO, LoginResponseSchema } from "application/dto/auth/shared/login.response.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ClientSessionResponseDTO, ClientSessionResponseSchema } from "application/dto/account/user/verify-session.dto";
import { TrainerSessionResponseDTO, TrainerSessionResponseSchema } from "application/dto/account/trainer/verify-session";
import { UserRole } from "domain/constants/user-role";
import { AuthUserPayloadDTO } from "application/dto/auth/shared/login.response.dto";
import { RefreshAccessTokenResponseDTO, RefreshAccessTokenResponseSchema } from "application/dto/auth/shared/refresh-token.dto";
import { RegisterResponseDTO, RegisterResponseSchema } from "application/dto/auth/shared/register.response.dto";

export class AuthMapper {
  static toLoginResponseDTO(accessToken: string, refreshToken: string, role: UserRole, user: AuthUserPayloadDTO): LoginResponseDTO {

    return LoginResponseSchema.parse({
      accessToken,
      refreshToken,
      role,
      user
    });
  }

  static toRegisterResponseDTO(email: string): RegisterResponseDTO {

    return RegisterResponseSchema.parse({
      email
    });
  }

  static toClientSessionResponseDTO(entity: UserEntity): ClientSessionResponseDTO {

    return ClientSessionResponseSchema.parse({
      name: entity.name,
      role: entity.role,
      profilePic: entity.profilePic ?? "",
      status: entity.status
    });
  }

  static toTrainerSessionResponseDTO(trainer: TrainerEntity): TrainerSessionResponseDTO {

    return TrainerSessionResponseSchema.parse({
      name: trainer.name,
      profilePic: trainer.profilePic ?? "",
      status: trainer.status,
      role: UserRole.TRAINER,
      verified: trainer.verified
    });
  }

  static toRefreshAccessTokenResponseDTO(accessToken: string, role: UserRole): RefreshAccessTokenResponseDTO {

    return RefreshAccessTokenResponseSchema.parse({
      accessToken,
      role
    });
  }
}