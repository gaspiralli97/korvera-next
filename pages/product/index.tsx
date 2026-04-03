import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import ProductCard from '../../libs/components/product/ProductCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(() => {
		try {
			return router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput;
		} catch {
			return initialInput;
		}
	});
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

	const maxProductLikes = useMemo(() => {
		if (products.length === 0) return 0;
		return Math.max(...products.map((p) => p.productLikes));
	}, [products]);

	/** APOLLO REQUESTS **/
    const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const {
			loading:getProductsLoading,
			data:getProductsData,
			error:getProductsError,
			refetch: getProductsRefetch,
		}=useQuery(GET_PRODUCTS, {
			fetchPolicy:'network-only',
			variables:{input:searchFilter},
			notifyOnNetworkStatusChange:true,
			onCompleted:(data:T)=>{
				setProducts(data?.getProducts?.list);
				setTotal(data?.getProducts?.metaCounter[0]?.total);
			},
		});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			try {
				const inputObj = JSON.parse(router?.query?.input as string);
				setSearchFilter(inputObj);
			} catch {
				setSearchFilter(initialInput);
			}
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		getProductsRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/product?input=${JSON.stringify(searchFilter)}`,
			`/product?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({ variables: { input: id } });
			const result = await getProductsRefetch({ input: searchFilter });
			setProducts(result.data?.getProducts?.list ?? []);
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<div id={'mob-product-list-page'}>
				<Stack className={'mob-pl-topbar'}>
					<Button
						className={'mob-pl-filter-btn'}
						onClick={() => setShowMobileFilter((prev) => !prev)}
						startIcon={<FilterListIcon />}
					>
						Filters
					</Button>
					<div>
						<Button
							className={'mob-pl-sort-btn'}
							onClick={sortingClickHandler}
							endIcon={<KeyboardArrowDownRoundedIcon />}
						>
							{filterSortName}
						</Button>
						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
							<MenuItem onClick={sortingHandler} id={'new'} disableRipple sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>New</MenuItem>
							<MenuItem onClick={sortingHandler} id={'lowest'} disableRipple sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>Lowest Price</MenuItem>
							<MenuItem onClick={sortingHandler} id={'highest'} disableRipple sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>Highest Price</MenuItem>
						</Menu>
					</div>
				</Stack>

				{showMobileFilter && (
					<Stack className={'mob-filter-wrap'}>
						{/* @ts-ignore */}
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						<Button className={'mob-filter-apply-btn'} onClick={() => setShowMobileFilter(false)}>
							Apply & Close
						</Button>
					</Stack>
				)}

				<Stack className={'mob-pl-grid'}>
					{products.map((product: Product, index: number) => (
						<ProductCard
							product={product}
							likeProductHandler={likeProductHandler}
							key={product?._id}
							isNew={(currentPage - 1) * searchFilter.limit + index < 20}
							isTrending={maxProductLikes > 0 && product.productLikes === maxProductLikes}
						/>
					))}
				</Stack>

				{products.length !== 0 && (
					<Stack className={'mob-pl-pagination'}>
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={handlePaginationChange}
							shape="circular"
							color="primary"
						/>
						<Typography>Total {total} product{total > 1 ? 's' : ''}</Typography>
					</Stack>
				)}
			</div>
		);
	} else {
		return (
			<div id="product-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'product-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{products.map((product: Product, index: number) => (
									<ProductCard
										product={product}
										likeProductHandler={likeProductHandler}
										key={product?._id}
										isNew={(currentPage - 1) * searchFilter.limit + index < 20}
										isTrending={maxProductLikes > 0 && product.productLikes === maxProductLikes}
									/>
								))}
							</Stack>
							<Stack className="pagination-config">
								{products.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{products.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} product{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			volumesRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 5,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(ProductList);
