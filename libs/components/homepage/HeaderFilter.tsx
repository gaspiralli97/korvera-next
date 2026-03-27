import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { productVolume } from '../../config';
import { ProductCategory, SkinType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface HeaderFilterProps {
	initialInput: ProductsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const categoryRef: any = useRef();
	const skinTypeRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [openSkinType, setOpenSkinType] = useState(false);
	const [productCategory, setProductCategory] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [skinTypes, setSkinTypes] = useState<SkinType[]>(Object.values(SkinType));

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!categoryRef?.current?.contains(event.target)) {
				setOpenCategory(false);
			}
			if (!skinTypeRef?.current?.contains(event.target)) {
				setOpenSkinType(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenCategory(false);
		setOpenSkinType(false);
		setOpenAdvancedFilter(status);
	};

	const categoryStateChangeHandler = () => {
		setOpenCategory((prev) => !prev);
		setOpenSkinType(false);
	};

	const skinTypeStateChangeHandler = () => {
		setOpenSkinType((prev) => !prev);
		setOpenCategory(false);
	};

	const disableAllStateHandler = () => {
		setOpenSkinType(false);
		setOpenCategory(false);
	};

	const productCategorySelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						categoryList: [value],
					},
				});
				skinTypeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, productCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const skinTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						skinTypeList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, skinTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productVolumeHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						volumesRange: { ...searchFilter.search.volumesRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						volumesRange: { ...searchFilter.search.volumesRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.categoryList?.length == 0) {
				delete searchFilter.search.categoryList;
			}

			if (searchFilter?.search?.skinTypeList?.length == 0) {
				delete searchFilter.search.skinTypeList;
			}

			await router.push(
				`/product?input=${JSON.stringify(searchFilter)}`,
				`/product?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openCategory ? 'on' : ''}`} onClick={categoryStateChangeHandler}>
							<span>{searchFilter?.search?.categoryList ? searchFilter?.search?.categoryList[0] : t('Category')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openSkinType ? 'on' : ''}`} onClick={skinTypeStateChangeHandler}>
							<span> {searchFilter?.search?.skinTypeList ? searchFilter?.search?.skinTypeList[0] : t('Skin Type')} </span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openCategory ? 'on' : ''}`} ref={categoryRef}>
						{productCategory.map((category: string) => {
							return (
								<div onClick={() => productCategorySelectHandler(category)} key={category}>
									<span>{category}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openSkinType ? 'on' : ''}`} ref={skinTypeRef}>
						{skinTypes.map((type: string) => {
							return (
								<div
									onClick={() => skinTypeSelectHandler(type)}
									key={type}
								>
									<span>{type}</span>
								</div>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your product</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Volume (ml)</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.volumesRange?.start}
													onChange={(e: any) => productVolumeHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
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
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.volumesRange?.end}
													onChange={(e: any) => productVolumeHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{productVolume
														?.slice(0)
														.reverse()
														.map((vol: number) => (
															<MenuItem value={vol} disabled={(searchFilter?.search?.volumesRange?.start ?? 0) >= vol} key={vol}>
																{vol}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			volumesRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
