import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';

export interface CartItem {
	productId: string;
	productTitle: string;
	productBrand: string;
	productPrice: number;
	productImage: string;
	qty: number;
	size: string;
}

const MOCK_CART: CartItem[] = [
	{
		productId: 'mock-1',
		productTitle: 'Advanced Snail 96 Mucin Power Essence',
		productBrand: 'COSRX',
		productPrice: 25,
		productImage: '/img/product/bigImage.png',
		qty: 1,
		size: '100 mL',
	},
	{
		productId: 'mock-2',
		productTitle: 'Water Sleeping Mask',
		productBrand: 'Laneige',
		productPrice: 30,
		productImage: '/img/product/bigImage.png',
		qty: 2,
		size: '70 mL',
	},
	{
		productId: 'mock-3',
		productTitle: 'AHA/BHA Clarifying Treatment Toner',
		productBrand: 'Some By Mi',
		productPrice: 18,
		productImage: '/img/product/bigImage.png',
		qty: 1,
		size: '150 mL',
	},
];

const loadCart = (): CartItem[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem('korvera_cart');
		if (raw) return JSON.parse(raw);
		// seed mock data for testing
		localStorage.setItem('korvera_cart', JSON.stringify(MOCK_CART));
		return MOCK_CART;
	} catch {
		return [];
	}
};

export const saveCart = (items: CartItem[]) => {
	if (typeof window === 'undefined') return;
	localStorage.setItem('korvera_cart', JSON.stringify(items));
};

export const cartVar = makeVar<CartItem[]>(loadCart());
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