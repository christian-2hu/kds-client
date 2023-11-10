import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderStatus } from 'src/app/models/food-order-status.model';

@Component({
  selector: 'app-order-btn',
  templateUrl: './order-btn.component.html',
  styleUrls: ['./order-btn.component.css'],
})
export class OrderBtnComponent {
  @Input({ required: true }) public orderStatus = OrderStatus.WAITING;
  @Input() public showCancelBtn: boolean = false;
  @Output() public orderStatusChangeEvent = new EventEmitter<OrderStatus>();

  public ngOnInit() {}

  public changeOrderStatus() {
    this.orderStatusChangeEvent.emit();
  }

  public changeOrderStatusTo(orderStatus: OrderStatus) {
    this.orderStatusChangeEvent.emit(orderStatus);
  }

  public get getOrderStatus(): typeof OrderStatus {
    return OrderStatus;
  }

  public get getButtonName(): string {
    switch (this.orderStatus) {
      case OrderStatus.WAITING:
        return 'Confirmar';
      case OrderStatus.CONFIRMED:
        return 'Preparar';
      case OrderStatus.PREPARING:
        return 'Finalizar';
      case OrderStatus.CANCELED:
        return 'Finalizar';
      default:
        return 'Finalizar';
    }
  }
}
