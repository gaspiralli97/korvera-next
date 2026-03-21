export interface WishlistInput {
	wishlistName: string;
}

export interface AddToWishlistInput {
	wishlistId: string;
	productId: string;
}

export interface RemoveFromWishlistInput {
	wishlistId: string;
	productId: string;
}
