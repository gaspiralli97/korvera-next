import { ProductCategory, ProductCertification, ProductStatus, ProductSize, SkinType, VariantType } from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface ProductKeyIngredient {
	name: string;
	benefit: string;
}

export interface ProductVariant {
	variantName: string;
	variantType: VariantType;
	variantPrice: number;
	variantVolume?: number;
	variantColor?: string;
	variantImages?: string[];
	variantSku?: string;
	isAvailable: boolean;
}

export interface Product {
	_id: string;
	productCategory: ProductCategory;
	productStatus: ProductStatus;
	productBrand: string;
	productTitle: string;
	productPrice: number;
	productVolume: number;
	productLeftCount?: number;
	productSize: ProductSize;
	productSkinType?: SkinType[];
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	productRating: number;
	productRatingCount: number;
	productImages: string[];
	productDesc?: string;
	// Cosmetics-specific
	ingredients?: string[];
	keyIngredients?: ProductKeyIngredient[];
	variants?: ProductVariant[];
	notRecommendedFor?: SkinType[];
	allergens?: string[];
	isHypoallergenic?: boolean;
	fragranceFree?: boolean;
	alcoholFree?: boolean;
	certifications?: ProductCertification[];
	paoMonths?: number;
	expirationDate?: Date;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	manufacturedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
