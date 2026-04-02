import numeral from 'numeral';
import { sweetMixinErrorAlert } from './sweetAlert';

export interface SaleInfo {
	discount: number;
	salePrice: number;
}

export function getSaleInfo(price: number): SaleInfo | null {
	if (price >= 100) return { discount: 20, salePrice: Math.round(price * 0.8 * 100) / 100 };
	if (price >= 60)  return { discount: 15, salePrice: Math.round(price * 0.85 * 100) / 100 };
	return null;
}

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0' ? numeral(value).format('0,0') : '';
};

export const likeTargetProductHandler = async (likeTargetProduct: any, id: string) => {
	try {
		await likeTargetProduct({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, likeTargetProductHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetBoardArticleHandler = async (likeTargetBoardArticle: any, id: string) => {
	try {
		await likeTargetBoardArticle({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, likeTargetBoardArticleHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetMemberHandler = async (likeTargetMember: any, id: string) => {
	try {
		await likeTargetMember({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, likeTargetMemberHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};
