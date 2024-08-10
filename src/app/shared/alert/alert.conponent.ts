import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.conponent.html',
  styleUrls: ['./alert.conponent.css'],
})
export class AlertComponent {
  @Input() message!: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
      this.close.emit();
  }
}
