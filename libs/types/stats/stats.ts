import { ProductCategory } from '../../enums/product.enum';

export interface CategoryCount {
	category: ProductCategory;
	count: number;
}

export interface DashboardStats {
	totalMembers: number;
	totalSellers: number;
	newMembersThisMonth: number;
	totalProducts: number;
	totalActiveProducts: number;
	totalSoldOutProducts: number;
	newProductsThisMonth: number;
	averagePlatformRating: number;
	totalRatings: number;
	totalBoardArticles: number;
	topCategories: CategoryCount[];
}

export interface SellerStats {
	totalProducts: number;
	activeProducts: number;
	soldOutProducts: number;
	totalProductLikes: number;
	totalProductViews: number;
	totalProductComments: number;
	averageProductRating: number;
	totalRatings: number;
	topProductTitle?: string;
}
