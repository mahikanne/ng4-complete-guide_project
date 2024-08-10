import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.conponent';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error!: string;

  private closeSub! : Subscription;

  @ViewChild(PlaceholderDirective) alertHost! : PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}
  ngOnDestroy(): void {
    if (this.closeSub) {
    this.closeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs!: Observable<AuthResponseData>;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.SignUp(email, password);
    }

    authObs.subscribe(
      (resData) => {
        this.error = resData.message;
        this.showErrorAlert(resData.message);
        this.isLoading = false;
        if (this.error == 'LOGIN_SUCCESSFULL') {
          this.router.navigate(['/recipes']);
        }
      },
      (errorMessage) => {
        console.log(errorMessage);

        this.error = errorMessage;

        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = '';
  }

  private showErrorAlert(message: string) {
    //const alertCmp = new AlertComponent();

    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

       const hostViewContainerRef =this.alertHost.viewContainerref;

       hostViewContainerRef.clear();

      const componentRef =  hostViewContainerRef.createComponent(alertCmpFactory);

      componentRef.instance.message = message;

      this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
      });

  }
}
