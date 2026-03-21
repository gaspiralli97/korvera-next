import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from './PropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/property/property';
import { SellerProductsInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { ProductStatus } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_AGENT_PROPERTIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProperties: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<SellerProductsInquiry>(initialInput);
	const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getAgentPropertiesLoading,
		data: getAgentPropertiesData,
		error: getAgentPropertiesError,
		refetch: getAgentPropertiesRefetch,
	} = useQuery(GET_AGENT_PROPERTIES, {
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

	const deletePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert("Are you sure to delete this property?")) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: 'DELETE',
						},
					},
				});
			}
			await getAgentPropertiesRefetch({ input: searchFilter });
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
			await getAgentPropertiesRefetch({ input: searchFilter }); 
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'SELLER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>KORVERA PROPERTIES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Properties</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
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
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.productStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography> }
						</Stack>

						{sellerProducts?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Property found!</p>
							</div>
						) : (
							sellerProducts.map((property: Product) => {
								return (
									<PropertyCard
										property={property}
										deletePropertyHandler={deletePropertyHandler}
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
									<Typography>{total} property available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default MyProperties;
