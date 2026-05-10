import { GENDER } from "domain/constants/gender";

export interface UpdateUserProfileDTO {
  name: string;
  phone: string;
  address: string;
  gender?: GENDER;
  age?: number;
}

export interface UserProfileUpdateRequestDTO {
  userId: string;
  data: UpdateUserProfileDTO
}