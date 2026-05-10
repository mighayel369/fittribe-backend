import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from 'config';
import { injectable, inject } from 'tsyringe';
import { randomUUID } from "crypto";
import { IUserRepo, I_USER_REPO_TOKEN } from 'domain/repositories/IUserRepo';
import { I_JWT_SERVICE_TOKEN, IJwtService } from 'domain/services/i-jwt.service';
import { IGoogleAuthService } from 'domain/services/IGoogleAuthService';
import { UserRole } from 'domain/constants/user-role';
import { UserEntity } from 'domain/entities/UserEntity';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';

@injectable()
export class GoogleAuthServiceImpl implements IGoogleAuthService {
  constructor(
    @inject(I_JWT_SERVICE_TOKEN) private _jwtService: IJwtService,
    @inject(I_USER_REPO_TOKEN) private _userRepo: IUserRepo
  ) { }

  initializeStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: config.GOOGLE_CALLBACK
        },
        async (_googleAccessToken, _googleRefreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(new Error(ERROR_MESSAGES.GOOGLE_DATA_FETCHING_ERROR), undefined);
            }

            let userDoc = await this._userRepo.findUserByEmail(email);

            if (!userDoc) {
              const newUser = new UserEntity(
                profile.displayName,
                email,
                randomUUID(),
                UserRole.USER,
                "",
                true,
                new Date(),
                undefined,
                undefined,
                profile.id,
              );

              userDoc = await this._userRepo.registerUser(newUser);
            }
            if (!userDoc) {
              return done(new Error(ERROR_MESSAGES.ACCOUNT_SETUP_FAILED), undefined);
            }
            const appAccessToken = this._jwtService.generateAccessToken({
              id: String(userDoc.userId),
              email: userDoc.email,
              role: userDoc.role
            });

            const authUser = {
              id: userDoc.userId,
              name: userDoc.name,
              email: userDoc.email,
              role: userDoc.role
            };

            done(null, { user: authUser, accessToken: appAccessToken });

          } catch (error) {
            done(error as Error, undefined);
          }
        }
      )
    );
  }
}