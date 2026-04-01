import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCategory, SkinType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { productVolume } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BRANDS } from '../../../apollo/user/query';
import { sweetMixinErrorAlert } from '../../sweetAlert';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const RATINGS = [
	{ label: '5 Stars', value: 5 },
	{ label: '4 Stars & up', value: 4 },
	{ label: '3 Stars & up', value: 3 },
	{ label: '2 Stars & up', value: 2 },
];

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [productCategory] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [skinType] = useState<SkinType[]>(Object.values(SkinType));
	const [searchText, setSearchText] = useState<string>('');
	const [openSections, setOpenSections] = useState({
		category: true,
		skinType: true,
		volume: true,
		price: true,
		brand: false,
		rating: false,
	});

	/** APOLLO **/
	const { data: brandsData } = useQuery(GET_PRODUCT_BRANDS, {
		fetchPolicy: 'cache-first',
	});
	const brands: string[] = brandsData?.getProductBrands ?? [];

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.categoryList?.length == 0) {
			const cleanSearch = { ...searchFilter.search };
			delete cleanSearch.categoryList;
			router.push(
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				{ scroll: false },
			).then();
		}

		if (searchFilter?.search?.skinTypeList?.length == 0) {
			const cleanSearch = { ...searchFilter.search };
			delete cleanSearch.skinTypeList;
			router.push(
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				{ scroll: false },
			).then();
		}

		if (searchFilter?.search?.brandList?.length == 0) {
			const cleanSearch = { ...searchFilter.search };
			delete cleanSearch.brandList;
			router.push(
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				`/product?input=${JSON.stringify({ ...searchFilter, search: cleanSearch })}`,
				{ scroll: false },
			).then();
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const productCategorySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
			const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.categoryList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
			}
		},
		[searchFilter],
	);

	const skinTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, skinTypeList: [...(searchFilter?.search?.skinTypeList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, skinTypeList: [...(searchFilter?.search?.skinTypeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.skinTypeList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								skinTypeList: searchFilter?.search?.skinTypeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								skinTypeList: searchFilter?.search?.skinTypeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
			}
		},
		[searchFilter],
	);

	const brandSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, brandList: [...(searchFilter?.search?.brandList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, brandList: [...(searchFilter?.search?.brandList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.brandList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: searchFilter?.search?.brandList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: searchFilter?.search?.brandList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
			}
		},
		[searchFilter],
	);

	const ratingSelectHandler = useCallback(
		async (e: any, minRating: number) => {
			try {
				const isChecked = e.target.checked;
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							minRating: isChecked ? minRating : undefined,
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							minRating: isChecked ? minRating : undefined,
						},
					})}`,
					{ scroll: false },
				);
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
			}
		},
		[searchFilter],
	);

	const productVolumeHandler = useCallback(
		async (e: any, type: string) => {
		const value = Number(e.target.value);

			if (type == 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							volumesRange: { ...searchFilter.search.volumesRange, start: value },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							volumesRange: { ...searchFilter.search.volumesRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							volumesRange: { ...searchFilter.search.volumesRange, end: value },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							volumesRange: { ...searchFilter.search.volumesRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const productPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: Number(value) },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: Number(value) },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: Number(value) },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: Number(value) },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				{/* Search */}
				<Stack className={'filter-search'} mb={'28px'}>
					<Typography className={'filter-title-main'}>Find Your Product</Typography>
					<Stack className={'filter-input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									router.push(
										`/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search, text: searchText } })}`,
										`/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search, text: searchText } })}`,
										{ scroll: false },
									).then();
								}
							}}
							endAdornment={
								<CancelRoundedIcon
									onClick={() => {
										setSearchText('');
										router.push(
											`/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search, text: '' } })}`,
											`/product?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search, text: '' } })}`,
											{ scroll: false },
										).then();
									}}
								/>
							}
						/>
						<Tooltip title="Reset all">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				{/* Category */}
				<Stack className={'filter-section'} mb={'4px'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('category')}>
						<Typography className={'filter-section-title'}>Category</Typography>
						{openSections.category ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.category && (
						<Stack className={'filter-section-body'}>
							{productCategory.map((category: string) => (
								<Stack className={'filter-check-row'} key={category}>
									<Checkbox
										id={category}
										className={'filter-checkbox'}
										color="default"
										size="small"
										value={category}
										checked={(searchFilter?.search?.categoryList || []).includes(category as ProductCategory)}
										onChange={productCategorySelectHandler}
									/>
									<label htmlFor={category} style={{ cursor: 'pointer' }}>
										<Typography className={'filter-check-label'}>{category}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>

				{/* Skin Type */}
				<Stack className={'filter-section'} mb={'4px'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('skinType')}>
						<Typography className={'filter-section-title'}>Skin Type</Typography>
						{openSections.skinType ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.skinType && (
						<Stack className={'filter-section-body'}>
							{skinType.map((type: string) => (
								<Stack className={'filter-check-row'} key={type}>
									<Checkbox
										id={type}
										className={'filter-checkbox'}
										color="default"
										size="small"
										value={type}
										onChange={skinTypeSelectHandler}
										checked={(searchFilter?.search?.skinTypeList || []).includes(type as SkinType)}
									/>
									<label htmlFor={type} style={{ cursor: 'pointer' }}>
										<Typography className={'filter-check-label'}>{type}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>

				{/* Volume */}
				<Stack className={'filter-section'} mb={'4px'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('volume')}>
						<Typography className={'filter-section-title'}>Volume (ml)</Typography>
						{openSections.volume ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.volume && (
						<Stack className={'filter-section-body'}>
							<Stack className={'filter-range-row'}>
								<FormControl size="small" sx={{ flex: 1 }}>
									<InputLabel>Min</InputLabel>
									<Select
										value={searchFilter?.search?.volumesRange?.start ?? 0}
										label="Min"
										onChange={(e: any) => productVolumeHandler(e, 'start')}
										MenuProps={MenuProps}
									>
										{productVolume.map((vol: number) => (
											<MenuItem
												value={vol}
												disabled={(searchFilter?.search?.volumesRange?.end || 0) < vol}
												key={vol}
											>
												{vol}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<span className={'filter-range-divider'}>—</span>
								<FormControl size="small" sx={{ flex: 1 }}>
									<InputLabel>Max</InputLabel>
									<Select
										value={searchFilter?.search?.volumesRange?.end ?? 500}
										label="Max"
										onChange={(e: any) => productVolumeHandler(e, 'end')}
										MenuProps={MenuProps}
									>
										{productVolume.map((vol: number) => (
											<MenuItem
												value={vol}
												disabled={(searchFilter?.search?.volumesRange?.start || 0) > vol}
												key={vol}
											>
												{vol}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
						</Stack>
					)}
				</Stack>

				{/* Price Range */}
				<Stack className={'filter-section'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('price')}>
						<Typography className={'filter-section-title'}>Price Range</Typography>
						{openSections.price ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.price && (
						<Stack className={'filter-section-body'}>
							<Stack className={'filter-range-row'}>
								<input
									className={'filter-price-input'}
									type="number"
									placeholder="$ min"
									min={0}
									value={searchFilter?.search?.pricesRange?.start ?? 0}
									onChange={(e: any) => {
										if (e.target.value >= 0) productPriceHandler(e.target.value, 'start');
									}}
								/>
								<span className={'filter-range-divider'}>—</span>
								<input
									className={'filter-price-input'}
									type="number"
									placeholder="$ max"
									value={searchFilter?.search?.pricesRange?.end ?? 0}
									onChange={(e: any) => {
										if (e.target.value >= 0) productPriceHandler(e.target.value, 'end');
									}}
								/>
							</Stack>
						</Stack>
					)}
				</Stack>

				{/* Brand */}
				<Stack className={'filter-section'} mb={'4px'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('brand')}>
						<Typography className={'filter-section-title'}>Brand</Typography>
						{openSections.brand ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.brand && (
						<Stack className={'filter-section-body'}>
							{brands.map((brand) => (
								<Stack className={'filter-check-row'} key={brand}>
									<Checkbox
										id={brand}
										className={'filter-checkbox'}
										color="default"
										size="small"
										value={brand}
										checked={(searchFilter?.search?.brandList || []).includes(brand)}
										onChange={brandSelectHandler}
									/>
									<label htmlFor={brand} style={{ cursor: 'pointer' }}>
										<Typography className={'filter-check-label'}>{brand}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>

				{/* Rating */}
				<Stack className={'filter-section'}>
					<Stack className={'filter-section-header'} onClick={() => toggleSection('rating')}>
						<Typography className={'filter-section-title'}>Rating</Typography>
						{openSections.rating ? <ExpandLessIcon className={'filter-chevron'} /> : <ExpandMoreIcon className={'filter-chevron'} />}
					</Stack>
					{openSections.rating && (
						<Stack className={'filter-section-body'}>
							{RATINGS.map((r) => (
								<Stack className={'filter-check-row'} key={r.value}>
									<Checkbox
										id={String(r.value)}
										className={'filter-checkbox'}
										color="default"
										size="small"
										checked={searchFilter?.search?.minRating === r.value}
										onChange={(e) => ratingSelectHandler(e, r.value)}
									/>
									<label htmlFor={String(r.value)} style={{ cursor: 'pointer' }}>
										<Typography className={'filter-check-label'}>{r.label}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
