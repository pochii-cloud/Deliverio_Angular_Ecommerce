import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category1, Product } from 'src/Interfaces/Interfaces';
import { CategoryService } from 'src/app/services/categoryservices/category.service';
import { ProductsService } from 'src/app/services/productservices/products.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
})
export class AddproductComponent implements OnInit {
  productForm!: FormGroup;
  product!: Product;
  categories!: Category1[];
  IsUpdateMode = false;
  existingproduct!: Product;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });

    this.getCategories();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;
    console.log(product);

    this.productService.getallproducts().subscribe((response) => {
      console.log('response is', response);
      
      this.existingproduct = response.find(
        (p: any) => p.name == product.name
      ) as Product;


      if (this.existingproduct?.name.toLowerCase()) {
        console.log('product exists');
        this.IsUpdateMode = true;
        this.product = this.existingproduct;
        this.populateFormWithExistingData();
      } else {
        console.log('product dont exists');
        this.productService.AddproductComponent(product).subscribe(
          (response) => {
            console.log('Product added successfully!', response);
            this.productForm.reset();
          },
          (error) => {
            console.error('Failed to add product:', error);
          }
        );
      }
    });
  }

  populateFormWithExistingData(): void {
    this.productForm.patchValue({
      category: this.existingproduct.category_id,
      name: this.existingproduct.name,
      description: this.existingproduct.description,
      images: this.existingproduct.images,
      price: this.existingproduct.price,
    });
  }

  getCategories() {
    this.categoryService.getCategory1().subscribe((response) => {
      this.categories = response;
    });
  }
}
