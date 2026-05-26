import { UserEntity } from "domain/entities/UserEntity";
import { UserResponseDTO } from "application/dto/management/user-management/all-users.dto";
import { UserProfileResponseDTO, UserProfileResponseSchema } from "application/dto/account/user/user-details.dto";
import { AdminUserDetailDTO } from "application/dto/management/user-management/user-profile.dto";
import { UserRegisterRequestDTO } from "application/dto/auth/user/user.register.dto";
import { randomUUID } from "crypto";
import { UserRole } from "domain/constants/user-role";
export class UserMapper {
  static toUserResponseDTO(entity: UserEntity): UserResponseDTO {

    return {
      userId: entity.userId,
      name: entity.name,
      email: entity.email,
      status: entity.status
    };
  }

  static toUserEntity(
    registrationRequest: UserRegisterRequestDTO,
    hashedPassword: string
  ): UserEntity {

    return new UserEntity(
      registrationRequest.name,
      registrationRequest.email,
      randomUUID(),
      UserRole.USER,
      hashedPassword
    );
  }

  static toAdminDetailDTO(user: UserEntity): AdminUserDetailDTO {

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt || new Date(),
      gender: user.gender,
      age: user.age,
      phone: user.phone ?? "",
      address: user.address ?? "",
      profilePic: user.profilePic ?? ""
    };
  }

  static toProfileResponseDTO(user: UserEntity): UserProfileResponseDTO {

    return UserProfileResponseSchema.parse({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      age: user.age,
      phone: user.phone ?? "",
      address: user.address ?? "",
      profilePic: user.profilePic ?? ""
    });
  }
}