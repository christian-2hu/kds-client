import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { Environment } from 'src/app/environment/environment';
import { FoodOrder } from 'src/app/models/food-order.model';
import { PaginatedContentResponse } from 'src/app/models/paginated-content-response.model';
import { PaginationResponse } from 'src/app/models/pagination-response.model';
import { OrderService } from 'src/app/services/order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  public orders: FoodOrder[] = [];
  public ordersPagination!: PaginationResponse;
  private ordersFetchInterval = interval(Environment.ordersFetchIntervalMs);

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      let response: PaginatedContentResponse<FoodOrder[]> = data['data'];
      if (response.error != undefined) {
        this.onServerError(response.error);
      }
      this.orders = response.content;
      this.ordersPagination = response.pagination;
    });
    this.fetchOrdersOnInterval(this.ordersFetchInterval);
  }

  private onServerError(error: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `${error}`,
    });
  }

  private fetchOrdersOnInterval(observableInterval: Observable<number>) {
    let ordersPipe = observableInterval.pipe();
    ordersPipe.subscribe(() => {
      this.fetchOrders();
    });
  }

  private fetchOrders() {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.content;
      },
      error: (error) => {
        this.onServerError(error);
      },
    });
  }
}
