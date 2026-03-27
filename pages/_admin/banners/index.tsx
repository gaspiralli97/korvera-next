import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Collapse,
	Button,
	TextField,
	Divider,
	InputAdornment,
	List,
	ListItem,
	OutlinedInput,
	Stack,
	TablePagination,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { BannerList } from '../../../libs/components/admin/banners/BannerList';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import {
	GET_ALL_BANNERS_BY_ADMIN,
} from '../../../apollo/admin/query';
import {
	CREATE_BANNER_BY_ADMIN,
	REMOVE_BANNER_BY_ADMIN,
	UPDATE_BANNER_BY_ADMIN,
} from '../../../apollo/admin/mutation';

const STATUS_TABS = ['ALL', 'ACTIVE', 'INACTIVE'];

const AdminBanners: NextPage = (props: any) => {
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState('ALL');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Create form state
	const [formOpen, setFormOpen] = useState(false);
	const [formTitle, setFormTitle] = useState('');
	const [formType, setFormType] = useState('HERO');
	const [formPosition, setFormPosition] = useState('');
	const [formLink, setFormLink] = useState('');

	/** APOLLO **/

	const {
		loading,
		data,
		refetch,
	} = useQuery(GET_ALL_BANNERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 100,
				search: {
					...(tabValue !== 'ALL' && { bannerStatus: tabValue }),
					...(typeFilter !== 'ALL' && { bannerType: typeFilter }),
					...(searchText && { text: searchText }),
				},
			},
		},
	});

	const [createBannerByAdmin] = useMutation(CREATE_BANNER_BY_ADMIN);
	const [updateBannerByAdmin] = useMutation(UPDATE_BANNER_BY_ADMIN);
	const [removeBannerByAdmin] = useMutation(REMOVE_BANNER_BY_ADMIN);

	const banners = data?.getAllBannersByAdmin?.list ?? [];
	const total = data?.getAllBannersByAdmin?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/

	const resetForm = () => {
		setFormTitle('');
		setFormType('HERO');
		setFormPosition('');
		setFormLink('');
	};

	const handleCancelForm = () => {
		setFormOpen(false);
		resetForm();
	};

	const handleSaveBanner = async () => {
		try {
			await createBannerByAdmin({
				variables: {
					input: {
						bannerTitle: formTitle.trim(),
						bannerType: formType,
						bannerLink: formLink.trim(),
						...(formPosition && { bannerPosition: parseInt(formPosition, 10) }),
					},
				},
			});
			setFormOpen(false);
			resetForm();
			await refetch();
			await sweetTopSuccessAlert('Banner created successfully!');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const onToggleHandler = async (id: string, currentStatus: string) => {
		try {
			await updateBannerByAdmin({
				variables: {
					input: {
						_id: id,
						bannerStatus: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
					},
				},
			});
			await refetch();
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const deleteHandler = async (id: string) => {
		const confirmed = await sweetConfirmAlert('Are you sure you want to delete this banner?');
		if (confirmed) {
			try {
				await removeBannerByAdmin({ variables: { input: id } });
				await refetch();
			} catch (err: any) {
				await sweetErrorHandling(err);
			}
		}
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
		setPage(0);
	}, []);

	const paginatedBanners = banners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const isSaveDisabled = !formTitle.trim() || !formLink.trim();

	return (
		<Box component={'div'} className={'content'}>
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mb: '24px' }}>
				<Typography variant={'h2'} className={'tit'}>
					Banners &amp; Content
				</Typography>
				<Button
					variant={'contained'}
					startIcon={<AddRoundedIcon />}
					onClick={() => setFormOpen((prev) => !prev)}
					sx={{
						background: '#2C1654',
						'&:hover': { background: '#3d2070' },
						fontWeight: 600,
						fontSize: '13px',
						textTransform: 'none',
						px: '18px',
						py: '8px',
					}}
				>
					ADD BANNER
				</Button>
			</Stack>

			<Collapse in={formOpen}>
				<Box component={'div'} className={'chart-card'} sx={{ mb: '20px' }}>
					<Typography variant={'h6'} sx={{ fontWeight: 700, color: '#1A1A2E', mb: '16px', fontSize: '15px' }}>
						New Banner
					</Typography>
					<Stack spacing={'16px'}>
						<TextField
							label={'Title'}
							fullWidth
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							placeholder={'e.g. Summer Sale — Up to 50% Off'}
							size={'small'}
						/>
						<Stack direction={'row'} spacing={'16px'}>
							<Box component={'div'} sx={{ minWidth: '180px' }}>
								<Typography variant={'subtitle2'} sx={{ mb: '6px', color: '#555', fontSize: '12px' }}>
									Type
								</Typography>
								<Select
									fullWidth
									value={formType}
									onChange={(e: SelectChangeEvent) => setFormType(e.target.value)}
									size={'small'}
								>
									<MenuItem value={'HERO'}>Hero</MenuItem>
									<MenuItem value={'PROMO'}>Promo</MenuItem>
									<MenuItem value={'CATEGORY'}>Category</MenuItem>
									<MenuItem value={'FEATURE'}>Feature</MenuItem>
								</Select>
							</Box>
							<TextField
								label={'Position'}
								type={'number'}
								value={formPosition}
								onChange={(e) => setFormPosition(e.target.value)}
								placeholder={'e.g. 9'}
								size={'small'}
								sx={{ width: '140px' }}
								inputProps={{ min: 1 }}
							/>
						</Stack>
						<TextField
							label={'Target Link'}
							fullWidth
							value={formLink}
							onChange={(e) => setFormLink(e.target.value)}
							placeholder={'e.g. /products?sale=summer'}
							size={'small'}
						/>
						<Stack direction={'row'} spacing={'12px'} justifyContent={'flex-end'}>
							<Button onClick={handleCancelForm} sx={{ color: '#888', textTransform: 'none' }}>
								Cancel
							</Button>
							<Button
								variant={'contained'}
								onClick={handleSaveBanner}
								disabled={isSaveDisabled}
								sx={{
									background: '#2C1654',
									'&:hover': { background: '#3d2070' },
									textTransform: 'none',
									fontWeight: 600,
								}}
							>
								Save Banner
							</Button>
						</Stack>
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
										onClick={() => {
											setTabValue(tab);
											setPage(0);
										}}
										value={tab}
										className={tabValue === tab ? 'li on' : 'li'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
									</ListItem>
								))}
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by banner title'}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => textHandler('')} />
											)}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
								<Select
									sx={{ width: '160px', ml: '20px' }}
									value={typeFilter}
									onChange={(e: SelectChangeEvent) => {
										setTypeFilter(e.target.value);
										setPage(0);
									}}
								>
									<MenuItem value={'ALL'}>All Types</MenuItem>
									<MenuItem value={'HERO'}>Hero</MenuItem>
									<MenuItem value={'PROMO'}>Promo</MenuItem>
									<MenuItem value={'CATEGORY'}>Category</MenuItem>
									<MenuItem value={'FEATURE'}>Feature</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>

						<BannerList
							banners={paginatedBanners.map((b: any) => ({
								id: b._id,
								title: b.bannerTitle,
								type: b.bannerType,
								position: b.bannerPosition,
								link: b.bannerLink,
								status: b.bannerStatus,
							}))}
							onToggle={(id: string) => {
								const banner = banners.find((b: any) => b._id === id);
								if (banner) onToggleHandler(id, banner.bannerStatus);
							}}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={banners.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => {
								setRowsPerPage(parseInt(e.target.value, 10));
								setPage(0);
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminBanners);
