import { catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  token: string;
  expiration: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  SignUp(varemail: string, varpassword: string) {
    return this.http
      .post<AuthResponseData>(
        'https://localhost:44384/api/Authenticate/login',
        {
          username: varemail,
          password: varpassword,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'An unknow error occured!';
          switch (errorRes.error.status) {
            case 401:
              errorMessage = 'Unauthorized user.';
              break;

            default:
              break;
          }
          return throwError(errorMessage);
        })
      );
  }
}
