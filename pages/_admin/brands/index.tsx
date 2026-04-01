import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	Collapse,
	Divider,
	InputAdornment,
	List,
	ListItem,
	OutlinedInput,
	Stack,
	TablePagination,
	TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { BrandList } from '../../../libs/components/admin/brands/BrandList';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_BRANDS_BY_ADMIN } from '../../../apollo/admin/query';
import { CREATE_BRAND_BY_ADMIN, REMOVE_BRAND_BY_ADMIN, UPDATE_BRAND_BY_ADMIN } from '../../../apollo/admin/mutation';
import { AllBrandsInquiry, BrandInput } from '../../../libs/types/brand/brand.input';
import { Brand } from '../../../libs/types/brand/brand';
import { BrandStatus } from '../../../libs/enums/brand.enum';
import { T } from '../../../libs/types/common';

const STATUS_TABS = ['ALL', 'ACTIVE', 'INACTIVE', 'PENDING'];

const AdminBrands: NextPage = ({ initialInquiry, ...props }: any) => {
	const [brandsInquiry, setBrandsInquiry] = useState<AllBrandsInquiry>(initialInquiry);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [brandsTotal, setBrandsTotal] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [formTitle, setFormTitle] = useState('');
	const [formImage, setFormImage] = useState('');

	/** APOLLO REQUESTS **/
	const [createBrandByAdmin] = useMutation(CREATE_BRAND_BY_ADMIN);
	const [updateBrandByAdmin] = useMutation(UPDATE_BRAND_BY_ADMIN);
	const [removeBrandByAdmin] = useMutation(REMOVE_BRAND_BY_ADMIN);

	const {
		loading,
		data,
		error,
		refetch: refetchBrands,
	} = useQuery(GET_ALL_BRANDS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: brandsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBrands(data?.getAllBrandsByAdmin?.list ?? []);
			setBrandsTotal(data?.getAllBrandsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		refetchBrands({ input: brandsInquiry }).then();
	}, [brandsInquiry]);

	/** HANDLERS **/
	const tabChangeHandler = (newValue: string) => {
		setTabValue(newValue);
		const newInquiry = { ...brandsInquiry, page: 1, search: { ...brandsInquiry.search } };
		if (newValue !== 'ALL') {
			newInquiry.search.brandStatus = newValue as BrandStatus;
		} else {
			delete newInquiry.search.brandStatus;
		}
		setBrandsInquiry(newInquiry);
	};

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => {
		setAnchorEl({});
	};

	const approveHandler = async (id: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Approve this brand?');
			if (confirmed) {
				await updateBrandByAdmin({ variables: { input: { _id: id, brandStatus: BrandStatus.ACTIVE } } });
				await refetchBrands({ input: brandsInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const rejectHandler = async (id: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Reject and remove this brand?');
			if (confirmed) {
				await removeBrandByAdmin({ variables: { input: id } });
				await refetchBrands({ input: brandsInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const updateStatusHandler = async (id: string, status: string) => {
		try {
			await updateBrandByAdmin({ variables: { input: { _id: id, brandStatus: status as BrandStatus } } });
			menuIconCloseHandler();
			await refetchBrands({ input: brandsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
	}, []);

	const clearSearchHandler = () => {
		setSearchText('');
		const newInquiry = { ...brandsInquiry, page: 1, search: { ...brandsInquiry.search } };
		delete newInquiry.search.text;
		setBrandsInquiry(newInquiry);
	};

	const handleSearchSubmit = () => {
		const newInquiry = { ...brandsInquiry, page: 1, search: { ...brandsInquiry.search } };
		if (searchText.trim()) {
			newInquiry.search.text = searchText.trim();
		} else {
			delete newInquiry.search.text;
		}
		setBrandsInquiry(newInquiry);
	};

	const handleSaveBrand = async () => {
		if (!formTitle.trim()) return;
		try {
			const input: BrandInput = {
				brandTitle: formTitle.trim(),
				brandImage: formImage.trim() || undefined,
			};
			await createBrandByAdmin({ variables: { input } });
			await refetchBrands({ input: brandsInquiry });
			setFormTitle('');
			setFormImage('');
			setShowForm(false);
			await sweetTopSuccessAlert('Brand created!');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const pendingCount = brands.filter((b) => b.brandStatus === BrandStatus.PENDING).length;

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'} className={'tit'}>
					Brand Management
				</Typography>
				<Button
					variant={'contained'}
					size={'medium'}
					onClick={() => setShowForm((prev) => !prev)}
					sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					{showForm ? 'CANCEL' : 'ADD BRAND'}
				</Button>
			</Box>

			<Collapse in={showForm}>
				<Box component={'div'} className={'chart-card'} sx={{ mb: '24px' }}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>
						Create New Brand
					</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Brand Name'}
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							size={'small'}
							fullWidth
							placeholder={'e.g. The Ordinary'}
						/>
						<TextField
							label={'Brand Image URL (optional)'}
							value={formImage}
							onChange={(e) => setFormImage(e.target.value)}
							size={'small'}
							fullWidth
							placeholder={'https://example.com/brand-logo.jpg'}
						/>
					</Box>
					<Stack direction={'row'} spacing={'12px'} sx={{ mt: '20px', justifyContent: 'flex-end' }}>
						<Button variant={'outlined'} size={'medium'} onClick={() => setShowForm(false)}>
							Cancel
						</Button>
						<Button
							variant={'contained'}
							size={'medium'}
							onClick={handleSaveBrand}
							disabled={!formTitle.trim()}
							sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
						>
							Save Brand
						</Button>
					</Stack>
				</Box>
			</Collapse>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={tabValue}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								{STATUS_TABS.map((tab) => (
									<ListItem
										key={tab}
										onClick={() => tabChangeHandler(tab)}
										value={tab}
										className={tabValue === tab ? 'li on' : 'li'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
										{tab === 'PENDING' && pendingCount > 0 && (
											<Box
												component={'span'}
												sx={{
													ml: '6px',
													px: '5px',
													borderRadius: '10px',
													background: '#E8A84A',
													color: '#fff',
													fontSize: '10px',
													fontWeight: 700,
													fontFamily: 'Poppins',
												}}
											>
												{pendingCount}
											</Box>
										)}
									</ListItem>
								))}
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by brand name'}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={clearSearchHandler}
												/>
											)}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<BrandList
							brands={brands}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							approveHandler={approveHandler}
							rejectHandler={rejectHandler}
							updateStatusHandler={updateStatusHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component={'div'}
							count={brandsTotal}
							rowsPerPage={brandsInquiry.limit}
							page={brandsInquiry.page - 1}
							onPageChange={(_, newPage) => setBrandsInquiry({ ...brandsInquiry, page: newPage + 1 })}
							onRowsPerPageChange={(e) => {
								setBrandsInquiry({ ...brandsInquiry, limit: parseInt(e.target.value, 10), page: 1 });
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminBrands.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminBrands);
