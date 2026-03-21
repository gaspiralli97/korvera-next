import { SkinType } from '../../enums/product.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../product/product';

export interface Rating {
	_id: string;
	memberId: string;
	productId: string;
	ratingScore: number;
	skinTypeResult?: SkinType;
	reviewText?: string;
	helpfulCount: number;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface Ratings {
	list: Rating[];
	metaCounter: TotalCounter[];
}

export interface RatingStats {
	averageRating: number;
	totalRatings: number;
	fiveStars: number;
	fourStars: number;
	threeStars: number;
	twoStars: number;
	oneStar: number;
}
