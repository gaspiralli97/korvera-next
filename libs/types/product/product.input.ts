import { ProductCategory, ProductCertification, ProductSize, ProductStatus, ProductSubCategory, SkinType, VariantType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

interface Range {
	start: number;
	end: number;
}

interface DateRange {
	start: Date;
	end: Date;
}

export interface ProductKeyIngredientInput {
	name: string;
	benefit: string;
}

export interface ProductVariantInput {
	variantName: string;
	variantType: VariantType;
	variantPrice: number;
	variantVolume?: number;
	variantColor?: string;
	variantImages?: string[];
	variantSku?: string;
	isAvailable: boolean;
}

export interface ProductInput {
	productCategory: ProductCategory;
	productSubCategory?: ProductSubCategory;
	productBrand: string;
	productTitle: string;
	productPrice: number;
	productVolume: number;
	productLeftCount?: number;
	productSize: ProductSize;
	productSkinType?: SkinType[];
	productImages: string[];
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
	memberId?: string;
	manufacturedAt?: Date;
}

interface PISearch {
	memberId?: string;
	categoryList?: ProductCategory[];
	subCategoryList?: ProductSubCategory[];
	skinTypeList?: SkinType[];
	pricesRange?: Range;
	volumesRange?: Range;
	text?: string;
	brandList?: string[];
	minRating?: number;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface PSSearch {
	memberId?: string;
	categoryList?: ProductCategory[];
	subCategoryList?: ProductSubCategory[];
	skinTypeList?: SkinType[];
	pricesRange?: Range;
	volumesRange?: Range;
	text?: string;
	certificationList?: ProductCertification[];
	ingredientKeyword?: string;
	allergenExclude?: string[];
	isHypoallergenic?: boolean;
	fragranceFree?: boolean;
	alcoholFree?: boolean;
}

export interface ProductSearchInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PSSearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface SellerProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productCategoryList?: ProductCategory[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
