import React from 'react';
import { Product } from '../../types/product/product';
import ProductCard from '../product/ProductCard';

interface TopProductCardProps {
	product: Product;
	likeProductHandler: any;
}

const TopProductCard = (props: TopProductCardProps) => {
	const { product, likeProductHandler } = props;
	return <ProductCard product={product} likeProductHandler={likeProductHandler} />;
};

export default TopProductCard;
