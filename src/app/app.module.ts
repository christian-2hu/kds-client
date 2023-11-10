import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { OrdersComponent } from './components/shared/order/orders.component';
import { OrderInfoComponent } from './components/shared/order-info/order-info.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { OrderComponent } from './components/order/order.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { OrderBtnComponent } from './components/shared/order/order-btn/order-btn.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserInfoComponent } from './components/shared/sidebar/user-info/user-info.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { CountDownComponent } from './components/shared/order/count-down/count-down.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    OrderInfoComponent,
    ButtonComponent,
    OrderComponent,
    SidebarComponent,
    UserInfoComponent,
    OrderBtnComponent,
    CountDownComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ProgressBarModule,
    PaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
