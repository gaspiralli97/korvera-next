import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { BrandList, MockBrand } from '../../../libs/components/admin/brands/BrandList';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';

/** HARDCODED MOCK DATA **/
const MOCK_BRANDS: MockBrand[] = [
	{ id: 'BRD-001', brandName: 'Luna Beauty Studio', sellerNick: 'luna_beauty', sellerEmail: 'luna@lunabeauty.com', products: 89, revenue: '$12,450', joinDate: '10 Jan 2025', status: 'ACTIVE' },
	{ id: 'BRD-002', brandName: 'Pure Glow Co.', sellerNick: 'pureglow', sellerEmail: 'hello@pureglow.com', products: 64, revenue: '$9,820', joinDate: '18 Feb 2025', status: 'ACTIVE' },
	{ id: 'BRD-003', brandName: 'Velvet Cosmetics', sellerNick: 'velvet_co', sellerEmail: 'info@velvetco.com', products: 52, revenue: '$8,340', joinDate: '02 Mar 2025', status: 'ACTIVE' },
	{ id: 'BRD-004', brandName: 'Rose & Pearl', sellerNick: 'rosepearl', sellerEmail: 'store@rosepearl.com', products: 41, revenue: '$6,790', joinDate: '22 Mar 2025', status: 'ACTIVE' },
	{ id: 'BRD-005', brandName: 'Bloom Skincare', sellerNick: 'bloomskin', sellerEmail: 'bloom@skincare.com', products: 35, revenue: '$5,230', joinDate: '05 Apr 2025', status: 'ACTIVE' },
	{ id: 'BRD-006', brandName: 'Aura Naturals', sellerNick: 'aura_nat', sellerEmail: 'aura@naturals.com', products: 0, revenue: '$0', joinDate: '25 Mar 2026', status: 'PENDING' },
	{ id: 'BRD-007', brandName: 'Dew Drop Beauty', sellerNick: 'dewdrop', sellerEmail: 'dew@beauty.com', products: 0, revenue: '$0', joinDate: '26 Mar 2026', status: 'PENDING' },
	{ id: 'BRD-008', brandName: 'Celestial Skin', sellerNick: 'celestialskin', sellerEmail: 'hi@celestialskin.com', products: 0, revenue: '$0', joinDate: '27 Mar 2026', status: 'PENDING' },
	{ id: 'BRD-009', brandName: 'Matte & More', sellerNick: 'mattemore', sellerEmail: 'shop@mattemore.com', products: 12, revenue: '$1,200', joinDate: '11 Dec 2024', status: 'BLOCK' },
	{ id: 'BRD-010', brandName: 'Gloss Empire', sellerNick: 'glossemp', sellerEmail: 'gloss@empire.com', products: 7, revenue: '$890', joinDate: '30 Nov 2024', status: 'BLOCK' },
];

const STATUS_TABS = ['ALL', 'ACTIVE', 'PENDING', 'BLOCK'];

const AdminBrands: NextPage = (props: any) => {
	const [brands, setBrands] = useState<MockBrand[]>(MOCK_BRANDS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	/** HANDLERS **/
	const tabChangeHandler = (newValue: string) => {
		setTabValue(newValue);
		setPage(0);
	};

	const menuIconClickHandler = (e: any, id: string) => {
		setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	};

	const menuIconCloseHandler = () => {
		setAnchorEl({});
	};

	const approveHandler = async (id: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Approve this seller brand?');
			if (confirmed) {
				setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'ACTIVE' } : b)));
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const rejectHandler = async (id: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Reject and remove this brand application?');
			if (confirmed) {
				setBrands((prev) => prev.filter((b) => b.id !== id));
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const updateStatusHandler = (id: string, status: string) => {
		setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
		menuIconCloseHandler();
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
	}, []);

	const clearSearchHandler = () => {
		setSearchText('');
	};

	/** FILTERED DATA **/
	const filteredBrands = brands.filter((brand) => {
		const matchesTab = tabValue === 'ALL' || brand.status === tabValue;
		const matchesType = searchType === 'ALL' || brand.status === searchType;
		const matchesSearch =
			!searchText ||
			brand.brandName.toLowerCase().includes(searchText.toLowerCase()) ||
			brand.sellerNick.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesType && matchesSearch;
	});

	const paginatedBrands = filteredBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Brand &amp; Seller Management
			</Typography>

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
										{tab === 'PENDING' && (
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
												{brands.filter((b) => b.status === 'PENDING').length}
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
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by brand name or seller username'}
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
								<Select
									sx={{ width: '160px', ml: '20px' }}
									value={searchType}
									onChange={(e: any) => setSearchType(e.target.value)}
								>
									<MenuItem value={'ALL'}>All Status</MenuItem>
									<MenuItem value={'ACTIVE'}>Active</MenuItem>
									<MenuItem value={'PENDING'}>Pending</MenuItem>
									<MenuItem value={'BLOCK'}>Blocked</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>

						<BrandList
							brands={paginatedBrands}
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
							count={filteredBrands.length}
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

export default withAdminLayout(AdminBrands);
