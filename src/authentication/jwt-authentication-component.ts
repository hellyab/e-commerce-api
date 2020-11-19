import {registerAuthenticationStrategy} from '@loopback/authentication';
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  inject,
} from '@loopback/core';
import {
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from '../keys';
import {UserRepository} from '../repositories';
import {TokenService, UserService} from '../services';
import {JWTAuthenticationStrategy} from './jwt-authentication-strategy';

export class JWTAuthenticationComponent implements Component {
  bindings: Binding[] = [
    // token bindings
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(TokenService),

    // user bindings
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(UserService),
    Binding.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository),
    // createBindingFromClass(SecuritySpecEnhancer),
    // ///refresh bindings
    // Binding.bind(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE).toClass(
    //   RefreshTokenService,
    // ),

    // //  Refresh token bindings
    // Binding.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
    //   RefreshTokenConstants.REFRESH_SECRET_VALUE,
    // ),
    // Binding.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
    //   RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE,
    // ),
    // Binding.bind(RefreshTokenServiceBindings.REFRESH_ISSUER).to(
    //   RefreshTokenConstants.REFRESH_ISSUER_VALUE,
    // ),
    // //refresh token repository binding
    // Binding.bind(RefreshTokenServiceBindings.REFRESH_REPOSITORY).toClass(
    //   RefreshTokenRepository,
    // ),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
  }
}
