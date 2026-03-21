import { Product } from '../property/property';
import { TotalCounter } from '../property/property';

export interface WishlistItem {
	productId: string;
	addedAt: Date;
	/** from aggregation **/
	productData?: Product;
}

export interface Wishlist {
	_id: string;
	memberId: string;
	wishlistName: string;
	products: WishlistItem[];
	productCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Wishlists {
	list: Wishlist[];
	metaCounter: TotalCounter[];
}
