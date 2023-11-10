import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/environment/environment';
import { CanceledOrderDetails } from 'src/app/models/cancel-order-event.model';
import { FoodOrder } from 'src/app/models/food-order.model';
import { PaginatedContentResponse } from 'src/app/models/paginated-content-response.model';
import { Response } from 'src/app/models/server-response.model';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  public getOrders(page: number = 0) {
    return this.http.get<PaginatedContentResponse<FoodOrder[]>>(
      `${Environment.api}/order?pageNumber=${page}`
    );
  }

  public getArchivedOrders(page: number = 0) {
    return this.http.get<PaginatedContentResponse<FoodOrder[]>>(
      `${Environment.api}/order/archive?pageNumber=${page}`
    );
  }

  public addOrder(order: FoodOrder) {
    return this.http.post<Response<FoodOrder>>(
      `${Environment.api}/order`,
      order
    );
  }

  public updateOrder(order: FoodOrder) {
    const id = order.id;
    return this.http.put<Response<FoodOrder>>(
      `${Environment.api}/order/${id}`,
      order
    );
  }

  public confirmOrder(id: number) {
    return this.http.post<Response<FoodOrder>>(
      `${Environment.api}/order/confirm/${id}`,
      null
    );
  }

  public cancelOrder(id: number, canceledOrderEvent: CanceledOrderDetails) {
    return this.http.post<Response<FoodOrder>>(
      `${Environment.api}/order/cancel/${id}`,
      canceledOrderEvent
    );
  }

  public deleteOrder(order: FoodOrder) {
    const id = order.id;
    return this.http.delete<Response<FoodOrder>>(
      `${Environment.api}/order/${id}`
    );
  }
}
