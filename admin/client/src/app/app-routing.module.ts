import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './components/pages/dash/dash.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './guards/authadmin.guard';
import { NotAuthGuard } from './guards/notauthadmin.guard';
import { EmailComponent } from './components/pages/email/email.component';
import { ResetComponent } from './components/pages/reset/reset.component';
import { AdduserComponent } from './components/pages/users/adduser/adduser.component';
import { UsersComponent } from './components/pages/users/users/users.component';
import { DeleteuserComponent } from './components/pages/users/deleteuser/deleteuser.component';
import { UniformsComponent } from './components/pages/uniforms/uniforms.component';
import { AdduniformsComponent } from './components/pages/uniforms/adduniforms/adduniforms.component';
import { EdituniformsComponent } from './components/pages/uniforms/edituniforms/edituniforms.component';
import { DeleteuniformsComponent } from './components/pages/uniforms/deleteuniforms/deleteuniforms.component';
import { MenuComponent } from './components/pages/menu/menu.component';
import { AddmenuComponent } from './components/pages/menu/addmenu/addmenu.component';
import { EditmenuComponent } from './components/pages/menu/editmenu/editmenu.component';
import { DeletemenuComponent } from './components/pages/menu/deletemenu/deletemenu.component';
import { AddinfoComponent } from './components/pages/dash/addinfo/addinfo.component';
import { EditinfoComponent } from './components/pages/dash/editinfo/editinfo.component';
import { DeleteinfoComponent } from './components/pages/dash/deleteinfo/deleteinfo.component';
import { InfoComponent } from './components/pages/dash/info/info.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { BillsComponent } from './components/pages/bills/bills.component';
import { PaymentsComponent } from './components/pages/payments/payments.component';
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
        path: 'email',
        component: EmailComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'reset/:token',
        component: ResetComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'user',
        component: AdduserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'delete/:id',
        component: DeleteuserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'uniforms',
        component: UniformsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'uniform',
        component: AdduniformsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edituniforms/:id',
        component: EdituniformsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'deleteuniform/:id',
        component: DeleteuniformsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'addfood',
        component: AddmenuComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'editmenu/:id',
        component: EditmenuComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'deletemenu/:id',
        component: DeletemenuComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'addinfo',
        component: AddinfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'editinfo/:id',
        component: EditinfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'deleteinfo/:id',
        component: DeleteinfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'info',
        component: InfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'bills',
        component: BillsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'payments',
        component: PaymentsComponent,
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