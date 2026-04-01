import { BrandStatus } from '../../enums/brand.enum';

export interface Brand {
	_id: string;
	brandTitle: string;
	brandImage?: string;
	brandStatus: BrandStatus;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Brands {
	list: Brand[];
	metaCounter: { total: number }[];
}
