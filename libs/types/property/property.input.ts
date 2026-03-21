import { ProductCategory, ProductStatus, ProductSize, SkinType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	productCategory: ProductCategory;
	productBrand: string;
	productTitle: string;
	productPrice: number;
	productVolume: number;
	productSize: ProductSize;
	productSkinType?: SkinType[];
	productImages: string[];
	productDesc?: string;
	memberId?: string;
	manufacturedAt?: Date;
}

interface PISearch {
	memberId?: string;
	categoryList?: ProductCategory[];
	skinTypeList?: SkinType[];
	pricesRange?: Range;
	volumesRange?: Range;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
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

interface Range {
	start: number;
	end: number;
}
