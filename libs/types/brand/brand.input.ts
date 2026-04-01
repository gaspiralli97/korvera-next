import { BrandStatus } from '../../enums/brand.enum';
import { Direction } from '../../enums/common.enum';

export interface BrandInput {
	brandTitle: string;
	brandImage?: string;
}

export interface BrandUpdate {
	_id: string;
	brandTitle?: string;
	brandImage?: string;
	brandStatus?: BrandStatus;
}

export interface AllBrandsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		brandStatus?: BrandStatus;
		text?: string;
	};
}
