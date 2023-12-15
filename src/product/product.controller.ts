import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  AddProductRequest,
  AddProductResponse,
  getProductByIdRequest,
  getProductByIdResponse,
  GetAllProductsResponse,
  DeleteProductByIdRequest,
  DeleteProductByIdResponse,
  Empty,
  PRODUCT_SERVICE_NAME
} from './product.pb';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'addProduct')
  async addProduct(request: AddProductRequest): Promise<AddProductResponse> {
    return this.productService.addProduct(request);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'getProductById')
  async getProductById(request: getProductByIdRequest): Promise<getProductByIdResponse> {
    return this.productService.getProductById(request);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'getAllProducts')
  async getAllProducts(request: Empty): Promise<GetAllProductsResponse> {
    return this.productService.getAllProducts(request);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'deleteProductById')
  async deleteProductById(request: DeleteProductByIdRequest): Promise<DeleteProductByIdResponse> {
    return this.productService.deleteProductById(request);
  }
}