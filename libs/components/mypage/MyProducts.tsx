import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCard } from './ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/product/product';
import { SellerProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { ProductStatus } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_SELLER_PRODUCTS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<SellerProductsInquiry>(initialInput);
	const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getSellerProductsLoading,
		data: getSellerProductsData,
		error: getSellerProductsError,
		refetch: getSellerProductsRefetch,
	} = useQuery(GET_SELLER_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setSellerProducts(data?.getSellerProducts?.list);
			setTotal(data?.getSellerProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProductStatus) => {
		setSearchFilter({ ...searchFilter, search: { productStatus: value } });
	};

	const deleteProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert("Are you sure to delete this product?")) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: 'DELETE',
						},
					},
				});
			}
			await getSellerProductsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) { 
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: status,
						},
					},
				});
			}
			await getSellerProductsRefetch({ input: searchFilter }); 
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'SELLER') {
		router.back();
	}

	if (device === 'mobile') {
		return (
			<div className={'mob-mypage-section'}>
				<Typography className={'mob-section-title'}>My Products</Typography>
				<Stack className={'mob-tab-row'}>
					<button
						className={`mob-tab-btn ${searchFilter.search.productStatus === 'ACTIVE' ? 'active' : ''}`}
						onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
					>
						On Sale
					</button>
					<button
						className={`mob-tab-btn ${searchFilter.search.productStatus === 'SOLD_OUT' ? 'active' : ''}`}
						onClick={() => changeStatusHandler(ProductStatus.SOLD_OUT)}
					>
						Sold Out
					</button>
				</Stack>
				{sellerProducts?.length === 0 ? (
					<div className={'mob-empty-state'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No products found</p>
					</div>
				) : (
					<>
						<div className={'mob-product-grid'}>
							{sellerProducts.map((product: Product) => (
								<ProductCard
									key={product._id}
									product={product}
									deleteProductHandler={deleteProductHandler}
									updateProductHandler={updateProductHandler}
								/>
							))}
						</div>
						<Stack className={'mob-pagination'}>
							<Pagination
								count={Math.ceil(total / searchFilter.limit)}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
					</>
				)}
			</div>
		);
	} else {
		return (
			<div id="my-products-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Products</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="product-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
							className={searchFilter.search.productStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.SOLD_OUT)}
							className={searchFilter.search.productStatus === 'SOLD_OUT' ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Product title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.productStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography> }
						</Stack>

						{sellerProducts?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Products found!</p>
							</div>
						) : (
							sellerProducts.map((product: Product) => {
								return (
									<ProductCard
										product={product}
										deleteProductHandler={deleteProductHandler}
										updateProductHandler={updateProductHandler}
									/>
								);
							})
						)}

						{sellerProducts.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} product{total !== 1 ? 's' : ''} available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default MyProducts;
