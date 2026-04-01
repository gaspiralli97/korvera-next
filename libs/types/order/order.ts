import { OrderStatus } from '../../enums/order.enum';

export interface OrderItem {
	productId: string;
	productTitle: string;
	productPrice: number;
	quantity: number;
}

export interface Order {
	_id: string;
	orderItems: OrderItem[];
	memberId: string;
	memberData?: {
		_id: string;
		memberNick: string;
		memberPhone: string;
		memberImage?: string;
	};
	totalAmount: number;
	orderStatus: OrderStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Orders {
	list: Order[];
	metaCounter: { total: number }[];
}
