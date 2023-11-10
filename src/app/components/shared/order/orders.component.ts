import { ReturnStatement } from '@angular/compiler';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Observable } from 'rxjs';
import { Environment } from 'src/app/environment/environment';
import { CanceledOrderDetails } from 'src/app/models/cancel-order-event.model';
import { OrderStatus } from 'src/app/models/food-order-status.model';
import { FoodOrder } from 'src/app/models/food-order.model';
import { IfoodCancellationCode } from 'src/app/models/ifood-cancellation-codes.model';
import { PaginatedContentResponse } from 'src/app/models/paginated-content-response.model';
import { PaginationResponse } from 'src/app/models/pagination-response.model';
import { OrderService } from 'src/app/services/order/order.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  public orderStatus = OrderStatus;
  @Input({ required: true }) public foodOrders: FoodOrder[] = [];
  @Input({ required: true }) public ordersPagination!: PaginationResponse;
  constructor(private orderService: OrderService, private router: Router) {}

  public async onChangeOrderStatus(
    order: FoodOrder,
    optionalOrderStatus?: OrderStatus
  ) {
    let orderStatus = this.getOrderStatusFromStringLiteral(
      order.foodOrderStatus
    );
    let nextStatus =
      optionalOrderStatus != undefined
        ? optionalOrderStatus
        : this.getNextOrderStatus(orderStatus);
    if (nextStatus == OrderStatus.COMPLETE) {
      const userInput = this.warnUserAboutUpdatingOrder(order, nextStatus);
      if ((await userInput).isDenied || (await userInput).isDismissed) {
        return;
      }
    }

    let canceledOrderEvent!: CanceledOrderDetails;
    if (nextStatus == OrderStatus.CANCELED) {
      const cancellationDetails = this.getCancellationDetails();
      if (
        (await cancellationDetails).isDenied ||
        (await cancellationDetails).isDismissed
      ) {
        return;
      }
      canceledOrderEvent = (await cancellationDetails).value!;
    }

    order.foodOrderStatus = this.getStringLiteralFromUnkown(
      OrderStatus[nextStatus]
    );

    switch (nextStatus) {
      case OrderStatus.CONFIRMED:
        this.confirmOrder(order.id!);
        break;
      case OrderStatus.CANCELED:
        console.log(order.id, canceledOrderEvent);
        this.cancelOrder(order.id!, canceledOrderEvent);
        break;
      default:
        this.updateOrder(order);
    }
  }

  private async getCancellationDetails(): Promise<
    SweetAlertResult<CanceledOrderDetails>
  > {
    let cancellationCodes = Object.values(IfoodCancellationCode).filter(
      (v) => !isNaN(Number(v))
    );
    let cancellationCodesMap = new Map<number, string>();
    cancellationCodes.forEach((key) => {
      cancellationCodesMap.set(
        key as number,
        IfoodCancellationCode[key as number]
      );
    });
    const userInput = await Swal.fire<string>({
      title: 'Select field validation',
      input: 'select',
      inputOptions: {
        'Motivo do cancelamento': cancellationCodesMap,
      },
      inputPlaceholder: 'Selecione o motivo do cancelamento',
      showCancelButton: true,
    });

    const cancellationReason = await Swal.fire<string>({
      title: 'Select field validation',
      input: 'text',

      inputPlaceholder: 'Selecione o motivo do cancelamento',
      showCancelButton: true,
    });

    let cancellationDetails: CanceledOrderDetails = {
      cancellationCode: userInput.value as string,
      reason: cancellationReason.value as string,
    };
    return {
      isConfirmed:
        userInput.isConfirmed == true && cancellationReason.isConfirmed == true,
      isDenied:
        userInput.isDenied == true || cancellationReason.isDenied == true,
      isDismissed:
        userInput.isDismissed == true || cancellationReason.isDismissed == true,
      value: cancellationDetails,
    };
  }

  public removeOrder(order: FoodOrder) {
    this.deleteOrderFromArray(order);
    this.orderService.deleteOrder(order).subscribe({
      next: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Pedido removido!`,
          text: 'O pedido foi removido! Você pode consultá-lo no arquivo.',
          showConfirmButton: true,
          timer: 3500,
        });
      },
      error: (error) => console.log(error),
    });
  }

  public onPageChange(pageEvent: PaginatorState) {
    let ordersObservable: Observable<PaginatedContentResponse<FoodOrder[]>>;
    ordersObservable = this.orderService.getOrders(pageEvent.page);

    if (this.router.url == '/archive') {
      ordersObservable = this.orderService.getArchivedOrders(pageEvent.page);
    }

    ordersObservable.subscribe({
      next: (response) => {
        this.foodOrders = response.content;
      },
      error: (error) => console.log(error),
    });
  }

  public getNextOrderStatus(orderStatus: OrderStatus) {
    switch (orderStatus) {
      case OrderStatus.WAITING:
        return OrderStatus.CONFIRMED;
      case OrderStatus.CONFIRMED:
        return OrderStatus.PREPARING;
      case OrderStatus.PREPARING:
        return OrderStatus.COMPLETE;
      default:
        return OrderStatus.CANCELED;
    }
  }

  public getOrderStatusFromStringLiteral(
    literal: 'WAITING' | 'PREPARING' | 'COMPLETE' | 'CANCELED' | 'CONFIRMED'
  ) {
    switch (literal) {
      case 'WAITING':
        return OrderStatus.WAITING;
      case 'CONFIRMED':
        return OrderStatus.CONFIRMED;
      case 'PREPARING':
        return OrderStatus.PREPARING;
      case 'COMPLETE':
        return OrderStatus.COMPLETE;
      case 'CANCELED':
        return OrderStatus.CANCELED;
      default:
        throw new Error('Could not get literal: ' + literal);
    }
  }

  // TODO: The array is ordered, a binary search can be done
  private deleteOrderFromArray(order: FoodOrder) {
    this.foodOrders.forEach((item, i) => {
      if (item == order) {
        this.foodOrders.splice(i, 1);
      }
    });
  }

  public getRemainingTimeToConfirmOrder(date: Date) {
    date = new Date(date);
    let currentDate = new Date();
    let createdAtUnixTimestampSeconds =
      Math.floor(date.getTime() / 1000) +
      Environment.delivery.ifood.confirmationDeadlineInSeconds;
    let currentTimeSeconds = Math.floor(currentDate.getTime() / 1000);
    return createdAtUnixTimestampSeconds - currentTimeSeconds;
  }

  private updateOrder(order: FoodOrder) {
    this.orderService.updateOrder(order).subscribe({
      next: (response) => {
        let updatedOrder: FoodOrder = response.data as FoodOrder;
        switch (updatedOrder.foodOrderStatus) {
          case 'COMPLETE':
            this.deleteOrderFromArray(order);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Pedido #${updatedOrder.id} foi finalizado!`,
              text: 'O pedido foi removido desta página, você pode vê-lo novamente no arquivo.',
              showConfirmButton: true,
              timer: 3500,
            });
            break;
        }
      },
      error: (error) => console.log(error),
    });
  }

  private confirmOrder(id: number) {
    this.orderService.confirmOrder(id).subscribe({
      next: (response) => {
        let updatedOrder: FoodOrder = response.data as FoodOrder;
        console.log(updatedOrder);
      },
      error: (error) => console.log(error),
    });
  }

  private cancelOrder(id: number, canceledOrderEvent: CanceledOrderDetails) {
    this.orderService.cancelOrder(id, canceledOrderEvent).subscribe({
      next: (response) => {
        let updatedOrder: FoodOrder = response.data as FoodOrder;
        console.log(response);
      },
      error: (error) => console.log(error),
    });
  }

  private async warnUserAboutUpdatingOrder(
    order: FoodOrder,
    nextStatus: OrderStatus
  ) {
    const userInput = await Swal.fire({
      title: `Atualizar pedido ${order.id} para ${OrderStatus[nextStatus]}?`,
      text: `Você está atualizando o pedido ${order.id} para ${OrderStatus[nextStatus]}, esta ação não é reversível e você não poderá mais interagir com esse pedido.`,
      showDenyButton: true,
      confirmButtonText: 'Atualizar',
      denyButtonText: `Não atualizar`,
    });
    return userInput;
  }

  private getStringLiteralFromUnkown(
    literal: unknown
  ): 'WAITING' | 'PREPARING' | 'COMPLETE' | 'CANCELED' | 'CONFIRMED' {
    switch (literal) {
      case 'WAITING':
        return 'WAITING';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'PREPARING':
        return 'PREPARING';
      case 'COMPLETE':
        return 'COMPLETE';
      case 'CANCELED':
        return 'CANCELED';
    }
    throw new Error('Could not get literal');
  }
}
