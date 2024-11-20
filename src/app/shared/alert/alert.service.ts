import { ViewContainerRef } from '@angular/core';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { AlertComponent } from './alert.conponent';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private closeSub!: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  showErrorAlter(message: string, viewContainerRef: ViewContainerRef) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;

    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub?.unsubscribe();
      viewContainerRef.clear();
    });
  }
}
