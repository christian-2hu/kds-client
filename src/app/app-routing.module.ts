import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './components/order/order.component';
import { OrderService } from './services/order/order.service';
import { catchError, of } from 'rxjs';

const routes: Routes = [
  {
    path: 'orders',
    component: OrderComponent,
    resolve: {
      data: () => {
        let orders = inject(OrderService).getOrders();
        return orders.pipe(
          catchError(() => {
            return of({ error: 'The server is not responding.' });
          })
        );
      },
    },
  },
  {
    path: 'archive',
    component: OrderComponent,
    resolve: {
      data: () => {
        let orders = inject(OrderService).getArchivedOrders();
        return orders.pipe(
          catchError(() => {
            return of({ error: 'Server failed' });
          })
        );
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
