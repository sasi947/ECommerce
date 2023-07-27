import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RouterModule } from '@angular/router';
import { EditproductComponent } from './editproduct/editproduct.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { UserHomeComponent } from './userhome/user-home.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductService } from './services/product.service';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayproductsComponent } from './displayproducts/displayproducts.component';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [
    AppComponent,
    AddProductComponent,
    EditproductComponent,
    DeleteProductComponent,
    HeaderComponent,
    LoginComponent,
    SellerHomeComponent,
    UserHomeComponent,
    ProductlistComponent,
    DisplayproductsComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent,
    AlertComponent,

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
