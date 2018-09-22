import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxMsgModule } from 'ngx-msg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthadminService } from './services/authadmin.service';
import { UserService } from './services/user.service';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashComponent } from './components/pages/dash/dash.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './guards/authadmin.guard';
import { NotAuthGuard } from './guards/notauthadmin.guard';
import { SubnavComponent } from './components/subnav/subnav.component';
import { EmailComponent } from './components/pages/email/email.component';
import { ResetComponent } from './components/pages/reset/reset.component';
import { AdduserComponent } from './components/pages/users/adduser/adduser.component';
import { UsersComponent } from './components/pages/users/users/users.component';
import { DeleteuserComponent } from './components/pages/users/deleteuser/deleteuser.component';
import { UniformsService } from './services/uniforms.service';
import { UniformsComponent } from './components/pages/uniforms/uniforms.component';
import { AdduniformsComponent } from './components/pages/uniforms/adduniforms/adduniforms.component';
import { EdituniformsComponent } from './components/pages/uniforms/edituniforms/edituniforms.component';
import { DeleteuniformsComponent } from './components/pages/uniforms/deleteuniforms/deleteuniforms.component';
import { MealsService } from './services/meals.service';
import { MenuComponent } from './components/pages/menu/menu.component';
import { AddmenuComponent } from './components/pages/menu/addmenu/addmenu.component';
import { EditmenuComponent } from './components/pages/menu/editmenu/editmenu.component';
import { InfoService } from './services/info.service';
import { DeletemenuComponent } from './components/pages/menu/deletemenu/deletemenu.component';
import { AddinfoComponent } from './components/pages/dash/addinfo/addinfo.component';
import { EditinfoComponent } from './components/pages/dash/editinfo/editinfo.component';
import { DeleteinfoComponent } from './components/pages/dash/deleteinfo/deleteinfo.component';
import { InfoComponent } from './components/pages/dash/info/info.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { BillsService } from './services/bills.service';
import { PaymentsService } from './services/payments.service';
import { BillsComponent } from './components/pages/bills/bills.component';
import { PaymentsComponent } from './components/pages/payments/payments.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    DashComponent,
    RegisterComponent,
    LoginComponent,
    SubnavComponent,
    EmailComponent,
    ResetComponent,
    AdduserComponent,
    UsersComponent,
    DeleteuserComponent,
    UniformsComponent,
    AdduniformsComponent,
    EdituniformsComponent,
    DeleteuniformsComponent,
    MenuComponent,
    AddmenuComponent,
    EditmenuComponent,
    DeletemenuComponent,
    AddinfoComponent,
    EditinfoComponent,
    DeleteinfoComponent,
    InfoComponent,
    NotfoundComponent,
    BillsComponent,
    PaymentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    HttpClientModule,
    HttpModule,
    NgxMsgModule.forRoot(),
    NgxSpinnerModule,
    Ng2SearchPipeModule
  ],
  providers: [AuthadminService, NgxSpinnerService, AuthGuard, NotAuthGuard, UserService, UniformsService, MealsService, InfoService, BillsService, PaymentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
