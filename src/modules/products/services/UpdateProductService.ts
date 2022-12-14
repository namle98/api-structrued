import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepositoty';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    name,
    price,
    quantity,
    id,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && productExists.name !== name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.quantity = quantity;
    product.price = price;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
