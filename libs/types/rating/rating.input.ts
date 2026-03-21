import { SkinType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface RatingInput {
	productId: string;
	ratingScore: number;
	skinTypeResult?: SkinType;
	reviewText?: string;
}

export interface RatingUpdate {
	_id: string;
	ratingScore?: number;
	skinTypeResult?: SkinType;
	reviewText?: string;
}

interface RISearch {
	productId?: string;
	memberId?: string;
}

export interface RatingsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: RISearch;
}
