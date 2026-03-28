import React from 'react';
import { Product } from '../../types/product/product';
import ProductCard from '../product/ProductCard';

interface PopularProductCardProps {
	product: Product;
	likeProductHandler?: any;
}

const PopularProductCard = (props: PopularProductCardProps) => {
	const { product, likeProductHandler } = props;
	return <ProductCard product={product} likeProductHandler={likeProductHandler} />;
};

export default PopularProductCard;
