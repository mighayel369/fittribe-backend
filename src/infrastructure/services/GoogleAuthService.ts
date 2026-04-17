import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from 'config';
import { injectable,inject } from 'tsyringe';
import { randomUUID } from "crypto";
import user from '../database/models/UserModel';
import { I_JWT_SERVICE_TOKEN, IJwtService } from 'domain/services/i-jwt.service';
import { IGoogleAuthService } from 'domain/services/IGoogleAuthService';
import { UserRole } from 'utils/Constants';

@injectable()
export class GoogleAuthServiceImpl implements IGoogleAuthService {
  constructor(@inject(I_JWT_SERVICE_TOKEN) private _jwtService:IJwtService){}
  initializeStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: config.GOOGLE_CALLBACK
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let userDoc = await user.findOne({ email: profile.emails?.[0].value });

            if (!userDoc) {
              userDoc = await user.create({
                userId:randomUUID(),
                googleId: profile.id,
                email: profile.emails?.[0].value,
                name: profile.displayName,
                verified: true,
                status: true
              });
            }

              const accessToken = this._jwtService.generateAccessToken({
                id: String(userDoc.userId),
                email: userDoc.email,
                role: UserRole.USER
              });

              let AuthUser={
                id:userDoc.userId,
                name:userDoc.name,
                email:userDoc.email
              }

            done(null, { user: AuthUser, accessToken });

          } catch (error) {
            done(error as Error, undefined);
          }
        }
      )
    );
  }
}
