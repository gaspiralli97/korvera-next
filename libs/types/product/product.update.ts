import { ProductCategory, ProductCertification, ProductSize, ProductStatus, SkinType, VariantType } from '../../enums/product.enum';
import { ProductKeyIngredientInput, ProductVariantInput } from './product.input';

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
	// Cosmetics-specific
	ingredients?: string[];
	keyIngredients?: ProductKeyIngredientInput[];
	variants?: ProductVariantInput[];
	notRecommendedFor?: SkinType[];
	allergens?: string[];
	isHypoallergenic?: boolean;
	fragranceFree?: boolean;
	alcoholFree?: boolean;
	certifications?: ProductCertification[];
	paoMonths?: number;
	expirationDate?: Date;
	soldAt?: Date;
	deletedAt?: Date;
	manufacturedAt?: Date;
}
