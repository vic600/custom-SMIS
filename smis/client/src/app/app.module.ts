import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-router.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { DashComponent } from './components/pages/dash/dash.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { AuthService } from './services/auth.service';
import { OrderService } from './services/order.service';
import { LoadingModule } from 'ngx-loading';
import { NotificationBarModule } from 'ngx-notification-bar/release';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMsgModule } from 'ngx-msg';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { OrderComponent } from './components/pages/order/order.component';
import { SlipComponent } from './components/pages/slip/slip.component';
import { PaymentsComponent } from './components/pages/payments/payments.component';
import { PaymentsService } from './services/payments.service';
import { ReceiptComponent } from './components/pages/receipt/receipt.component';
import { RepayComponent } from './components/pages/repay/repay.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { SubnavComponent } from './components/subnav/subnav.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashComponent,
    RegisterComponent,
    FooterComponent,
    LoginComponent,
    OrderComponent,
    SlipComponent,
    PaymentsComponent,
    ReceiptComponent,
    RepayComponent,
    NotfoundComponent,
    SubnavComponent,

  ],
  imports: [
    BrowserModule,
    FilterPipeModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    LoadingModule,
    NotificationBarModule,
    BrowserAnimationsModule,
    NgxMsgModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, OrderService, PaymentsService, NgxSpinnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
