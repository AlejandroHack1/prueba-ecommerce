import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { TokenAuthService } from './token-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService implements HttpInterceptor {
  constructor(private tokenAuthService: TokenAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const jwtHeaderToken = this.tokenAuthService.getJwtToken();
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + jwtHeaderToken,
      },
    });
    return next.handle(req);
  }
}
