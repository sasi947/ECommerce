import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {

  
  productData: product = {
    name: '',
    price: 0,
    category: '',
    color: '',
    description: '',
    image: '',
    image1: '',
    image2: '',
    id: 0,
    quantity: undefined,
    productId: ''
  };
  
  productMessage: undefined | string;

  constructor(private route: ActivatedRoute, private product: ProductService) {}

  ngOnInit(): void {
    // let productId = this.route.snapshot.paramMap.get('id');
    // console.warn(productId);
    // productId &&
    //   this.product.getProduct(productId).subscribe((data) => {
    //     console.warn(data);
    //     this.productData = data;
    //   });
  }

  submit(data: any) {
    if (this.productData) {
      data.id = this.productData.id;
    }

    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product has been updated.';
      }
    });

    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);

    console.warn(data);
  }
}
