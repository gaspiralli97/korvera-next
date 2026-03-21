import { ProductCategory, ProductStatus, ProductSize, SkinType } from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productCategory?: ProductCategory;
	productStatus?: ProductStatus;
	productBrand?: string;
	productTitle?: string;
	productPrice?: number;
	productVolume?: number;
	productSize?: ProductSize;
	productSkinType?: SkinType[];
	productImages?: string[];
	productDesc?: string;
	soldAt?: Date;
	deletedAt?: Date;
	manufacturedAt?: Date;
}
