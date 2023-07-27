import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { UserHomeComponent } from './userhome/user-home.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { DisplayproductsComponent } from './displayproducts/displayproducts.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './alert/alert.component';

const routes: Routes = [
  { path: 'edit-product/:id', component: EditproductComponent },
  {path:"addProduct",component:AddProductComponent},
  { path: 'admin-home', component: SellerHomeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  {path:'',component:LoginComponent},
  {path:'productlist',component:ProductlistComponent},
  {path:'productlist/:id',component:ProductlistComponent},
  { path: 'products', component:ProductdetailsComponent },
  { path: 'product-details/:id', component:ProductdetailsComponent },
  {path:"displayproducts/:id",component:DisplayproductsComponent},
  {path:'displayproducts',component:DisplayproductsComponent},
  {path:'cart',component:CartComponent},
  {path:"checkout",component:CheckoutComponent},
  {path:'orders',component:OrdersComponent},
  {path:'header',component:HeaderComponent},
  {path:'alert',component:AlertComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
