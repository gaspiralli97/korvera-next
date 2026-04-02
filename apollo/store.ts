import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';

export interface CartItem {
	productId: string;
	productTitle: string;
	productBrand: string;
	productPrice: number;   // final (discounted) price
	oldPrice?: number;      // original price — defined only when product is on sale
	productImage: string;
	qty: number;
	size: string;
	stockCount?: number;
}

const cartKey = (userId: string) => (userId ? `korvera_cart_${userId}` : 'korvera_cart_guest');

const loadCart = (userId = ''): CartItem[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(cartKey(userId));
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

export const saveCart = (items: CartItem[], userId = '') => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(cartKey(userId), JSON.stringify(items));
};

export const cartVar = makeVar<CartItem[]>(loadCart());

export const switchUserCart = (userId: string) => {
	const items = loadCart(userId);
	cartVar(items);
};
export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberProducts: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});

//@ts-ignore
export const socketVar = makeVar<WebSocket>();

// Reactive Variable hosil qilindi
// ReactQuery + cache
// useMemo/useCallback + cache
// Reactive Variable + cache
// Hammasi cache da saqlanmoqda => asosiy sababi => butin Browserga ochiq!