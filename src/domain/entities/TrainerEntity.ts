import { UserRole } from "domain/constants/user-role";
import { GENDER } from 'domain/constants/gender'
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { LANGUAGE } from "domain/constants/language-type";
export class TrainerEntity {
  constructor(
    public trainerId: string,
    public name: string,
    public email: string,
    public role: UserRole.TRAINER,
    public verified: TRAINER_STATUS,
    public pricePerSession: number,
    public password: string | null,
    public languages: LANGUAGE[] = [],
    public experience = 0,
    public programs: string[] = [],
    public certificate: string | null = null,
    public gender: GENDER,
    public rating = 0,
    public reviewCount = 0,
    public status = true,
    public createdAt?: Date,
    public bio: string | null = null,
    public phone: string | null = null,
    public address: string | null = null,
    public rejectReason: string | null = null,
    public profilePic: string | null = null
  ) { }

  public isBlocked(): boolean {
    return !this.status;
  }

  update(fields: Partial<TrainerEntity>): TrainerEntity {
    return new TrainerEntity(
      this.trainerId,
      fields.name ?? this.name,
      this.email,
      this.role,
      fields.verified ?? this.verified,
      fields.pricePerSession ?? this.pricePerSession,
      this.password,
      fields.languages ?? this.languages,
      fields.experience ?? this.experience,
      fields.programs ?? this.programs,
      fields.certificate ?? this.certificate,
      fields.gender ?? this.gender,
      this.rating,
      this.reviewCount,
      this.status,
      this.createdAt,
      fields.bio ?? this.bio,
      fields.phone ?? this.phone,
      fields.address ?? this.address,
      this.rejectReason,
      this.profilePic
    );
  }
}
