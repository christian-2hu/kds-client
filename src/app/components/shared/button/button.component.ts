import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() btnText: string = 'Click';
  @Input() btnType: string = 'submit';
  @Input() isBtnDisabled: boolean = false;

  public click(): void {
    this.onClick.emit();
  }
}
