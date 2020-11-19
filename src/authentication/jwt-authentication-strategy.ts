import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {inject, injectable} from '@loopback/core';
import {
  asSpecEnhancer,
  HttpErrors,
  mergeSecuritySchemeToSpec,
  OASEnhancer,
  OpenApiSpec,
  Request,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings, UserServiceBindings} from '../keys';
import {User} from '../models';
import {TokenService, UserService} from '../services';

@injectable(asAuthStrategy, asSpecEnhancer)
export class JWTAuthenticationStrategy
  implements OASEnhancer, AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    private userService: UserService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const token: string = this.extractCredentials(request);
    const user: User = await this.tokenService.verifyToken(token);
    const userProfile: UserProfile = await this.userService.convertToUserProfile(
      user,
    );
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    return parts[1];
  }

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    return mergeSecuritySchemeToSpec(spec, this.name, {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    });
  }
}
