import { Injectable } from '@nestjs/common';
import { 
  AddProductRequest, 
  AddProductResponse, 
  DeleteProductByIdRequest, 
  DeleteProductByIdResponse, 
  Empty, 
  GetAllProductsResponse, 
  getProductByIdRequest, 
  getProductByIdResponse, 
} from './product.pb';

import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {


    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    ) { }

    async addProduct(request: AddProductRequest): Promise<AddProductResponse> {
        try {
            const product = await this.productModel.findOne({ name: request.name }).exec();
            console.log(product);
            if (product !== null ) {
                return { product: undefined, error: 
                    { message: "Producto ya existe" } }
            };

            const newProduct: Product = {
                id: undefined,
                name: request.name,
                price: request.price,
                
            };
            const createdProduct = new this.productModel(newProduct);
            await createdProduct.save();
            return {
                product: {
                    id: createdProduct._id,
                    name: createdProduct.name,
                    price: createdProduct.price,
                },
                error: undefined,
            };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getAllProducts(request: Empty): Promise<GetAllProductsResponse> {
        try {
            const productList = await this.productModel.find().lean().exec();

            const transformedProducts = productList.map(product => {
                product.id = product._id.toString();
                delete product._id;
                return product;
            });

            return { products: transformedProducts, error: undefined };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProductById(request: getProductByIdRequest): Promise<getProductByIdResponse> {
        try {
            const productFound = await this.productModel.findOne({ _id: request.id }).exec();
            
                const p = {
                    id: productFound._id, 
                    name: productFound.name,
                    price: productFound.price,
                };
                return { product: p, error: undefined };

        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async deleteProductById(request: DeleteProductByIdRequest): Promise<DeleteProductByIdResponse> {
        try {

            const deletedProduct = await this.productModel.findByIdAndDelete(request.id).exec();

            if (!deletedProduct) {
                return { isDeleted: false, error: 
                    { message: "Producto no Encontrado" } };
            }

            return { isDeleted: true, error: undefined};
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        } 
    }
}