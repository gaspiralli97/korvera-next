import { OrderStatus } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';

export interface OrderItemInput {
	productId: string;
	productTitle: string;
	productPrice: number;
	quantity: number;
}

export interface OrderInput {
	orderItems: OrderItemInput[];
	totalAmount: number;
}

export interface OrderUpdate {
	_id: string;
	orderStatus?: OrderStatus;
}

export interface AllOrdersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		orderStatus?: OrderStatus;
		text?: string;
	};
}
