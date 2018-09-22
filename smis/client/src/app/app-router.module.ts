import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './components/pages/dash/dash.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { OrderComponent } from './components/pages/order/order.component';
import { SlipComponent } from './components/pages/slip/slip.component';
import { PaymentsComponent } from './components/pages/payments/payments.component';
import { ReceiptComponent } from './components/pages/receipt/receipt.component';
import { RepayComponent } from './components/pages/repay/repay.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
const appRoutes: Routes = [
  {
    path: '',
    component: DashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dash',
    component: DashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'slip/:id',
    component: SlipComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pay',
    component: PaymentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'receipt/:id',
    component: ReceiptComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'repay/:id',
    component: RepayComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotfoundComponent,
    canActivate: [NotAuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,

    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }