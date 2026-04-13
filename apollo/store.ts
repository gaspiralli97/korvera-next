import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
import { Member } from '../libs/types/member/member';

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

const likedKey = (userId: string) => (userId ? `korvera_liked_${userId}` : 'korvera_liked_guest');

const loadLiked = (userId = ''): Set<string> => {
	if (typeof window === 'undefined') return new Set();
	try {
		const raw = localStorage.getItem(likedKey(userId));
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
};

export const saveLiked = (ids: Set<string>, userId = '') => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(likedKey(userId), JSON.stringify([...ids]));
};

export const likedProductIdsVar = makeVar<Set<string>>(loadLiked());

export const switchUserLiked = (userId: string) => {
	likedProductIdsVar(loadLiked(userId));
};

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

// Online bo'lgan authenticated userlar ro'yxati
export const onlineUsersVar = makeVar<Member[]>([]);

// Reactive Variable hosil qilindi
// ReactQuery + cache
// useMemo/useCallback + cache
// Reactive Variable + cache
// Hammasi cache da saqlanmoqda => asosiy sababi => butin Browserga ochiq!