import React from 'react';
import { Product } from '../../types/product/product';
import ProductCard from '../product/ProductCard';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: any;
}

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product, likeProductHandler } = props;
	return <ProductCard product={product} likeProductHandler={likeProductHandler} />;
};

export default TrendProductCard;
