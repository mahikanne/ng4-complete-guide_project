import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTImer: any;
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(varemail: string, varpassword: string) {
    return this.http
      .post<AuthResponseData>('https://localhost:7268/api/Auth/Login', {
        Email: varemail,
        Password: varpassword,
      })
      .pipe(
        catchError(this.handleError),
        tap((resdata) => {
          this.handleAuthentication(
            resdata.email,
            resdata.localId,
            resdata.idToken,
            resdata.expiresIn
          );
        })
      );
  }

  SignUp(varemail: string, varpassword: string) {
    return this.http
      .post<AuthResponseData>(
        'https://localhost:7268/api/Auth/UserRegistration',
        {
          Email: varemail,
          Password: varpassword,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resdata) => {
          this.handleAuthentication(
            resdata.email,
            resdata.localId,
            resdata.idToken,
            resdata.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ) {
    //const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const expirationDate = new Date(expiresIn);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(20000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknow error occured!';

    if (!errorRes.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.status) {
      case '401':
        errorMessage = 'Unauthorized user.';
        break;

      default:
        break;
    }
    return throwError(errorMessage);
  }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '');

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );


    if (loadedUser.token) {
      this.autoLogout(99000000000);
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTImer) {
      clearTimeout(this.tokenExpirationTImer);
    }
    this.tokenExpirationTImer = null;
  }

  autoLogout(expirationduration: number) {
    this.tokenExpirationTImer = setTimeout(() => {
      //this.logout();
    }, expirationduration);
  }
}
