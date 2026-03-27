import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, Collapse, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddIcon from '@mui/icons-material/Add';
import { CouponList, MockCoupon } from '../../../libs/components/admin/coupons/CouponList';
import { sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const MOCK_COUPONS: MockCoupon[] = [
	{ id: 'CPN-001', code: 'SPRING20', type: 'PERCENT', discount: '20%', minOrder: '$50.00', usage: '245 / 500', expiry: '30 Jun 2026', status: 'ACTIVE' },
	{ id: 'CPN-002', code: 'NEWUSER10', type: 'PERCENT', discount: '10%', minOrder: '$30.00', usage: '89 / 1000', expiry: '31 Dec 2026', status: 'ACTIVE' },
	{ id: 'CPN-003', code: 'BEAUTY15', type: 'PERCENT', discount: '15%', minOrder: '$0.00', usage: '167 / 300', expiry: '15 Apr 2026', status: 'ACTIVE' },
	{ id: 'CPN-004', code: 'VIPCLUB25', type: 'PERCENT', discount: '25%', minOrder: '$100.00', usage: '34 / 100', expiry: '01 May 2026', status: 'ACTIVE' },
	{ id: 'CPN-005', code: 'SAVE15NOW', type: 'FIXED', discount: '$15', minOrder: '$80.00', usage: '88 / 200', expiry: '20 Apr 2026', status: 'ACTIVE' },
	{ id: 'CPN-006', code: 'FREESHIP', type: 'FIXED', discount: '$5', minOrder: '$80.00', usage: '500 / 500', expiry: '28 Feb 2026', status: 'EXPIRED' },
	{ id: 'CPN-007', code: 'WINTER30', type: 'PERCENT', discount: '30%', minOrder: '$60.00', usage: '312 / 400', expiry: '31 Jan 2026', status: 'EXPIRED' },
	{ id: 'CPN-008', code: 'TESTDEAL', type: 'PERCENT', discount: '5%', minOrder: '$0.00', usage: '2 / 50', expiry: '30 Jun 2026', status: 'DISABLED' },
];

const STATUS_TABS = ['ALL', 'ACTIVE', 'EXPIRED', 'DISABLED'];

const DEFAULT_FORM = { code: '', type: 'PERCENT', discount: '', minOrder: '', limit: '', expiry: '' };

const AdminCoupons: NextPage = (props: any) => {
	const [coupons, setCoupons] = useState<MockCoupon[]>(MOCK_COUPONS);
	const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [showCreate, setShowCreate] = useState(false);
	const [formData, setFormData] = useState(DEFAULT_FORM);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const menuIconClickHandler = (e: any, id: string) => setAnchorEl((prev) => ({ ...prev, [id]: e.currentTarget }));
	const menuIconCloseHandler = () => setAnchorEl({});

	const updateCouponHandler = (id: string, status: string) => {
		setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
		menuIconCloseHandler();
	};

	const removeCouponHandler = (id: string) => {
		setCoupons((prev) => prev.filter((c) => c.id !== id));
		menuIconCloseHandler();
	};

	const createCouponHandler = async () => {
		if (!formData.code || !formData.discount) return;
		const newCoupon: MockCoupon = {
			id: `CPN-${Date.now()}`,
			code: formData.code.toUpperCase(),
			type: formData.type,
			discount: formData.type === 'PERCENT' ? `${formData.discount}%` : `$${formData.discount}`,
			minOrder: formData.minOrder ? `$${formData.minOrder}` : '$0.00',
			usage: `0 / ${formData.limit || '∞'}`,
			expiry: formData.expiry || 'No expiry',
			status: 'ACTIVE',
		};
		setCoupons((prev) => [newCoupon, ...prev]);
		setFormData(DEFAULT_FORM);
		setShowCreate(false);
		await sweetTopSuccessAlert('Coupon created successfully!');
	};

	const textHandler = useCallback((value: string) => setSearchText(value), []);

	const filteredCoupons = coupons.filter((c) => {
		const matchesTab = tabValue === 'ALL' || c.status === tabValue;
		const matchesSearch = !searchText || c.code.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const paginatedCoupons = filteredCoupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mb: '24px' }}>
				<Typography variant={'h2'} className={'tit'}>
					Coupons &amp; Promotions
				</Typography>
				<Button
					variant={'contained'}
					className={'btn-add'}
					startIcon={<AddIcon />}
					onClick={() => setShowCreate((prev) => !prev)}
					sx={{ background: '#2C1654', '&:hover': { background: '#3D2070' } }}
				>
					{showCreate ? 'Cancel' : 'Create Coupon'}
				</Button>
			</Stack>

			{/* Create Form */}
			<Collapse in={showCreate}>
				<Box component={'div'} className={'chart-card'} sx={{ mb: '24px' }}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>New Coupon</Typography>
					<Box component={'div'} className={'coupon-form-grid'}>
						<TextField
							label={'Coupon Code'}
							value={formData.code}
							onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
							size={'small'}
							placeholder={'e.g. SUMMER30'}
							sx={{ textTransform: 'uppercase' }}
						/>
						<Select
							value={formData.type}
							onChange={(e: any) => setFormData((p) => ({ ...p, type: e.target.value }))}
							size={'small'}
						>
							<MenuItem value={'PERCENT'}>Percentage (%)</MenuItem>
							<MenuItem value={'FIXED'}>Fixed Amount ($)</MenuItem>
						</Select>
						<TextField
							label={formData.type === 'PERCENT' ? 'Discount (%)' : 'Discount ($)'}
							value={formData.discount}
							onChange={(e) => setFormData((p) => ({ ...p, discount: e.target.value }))}
							size={'small'}
							type={'number'}
						/>
						<TextField
							label={'Min Order ($)'}
							value={formData.minOrder}
							onChange={(e) => setFormData((p) => ({ ...p, minOrder: e.target.value }))}
							size={'small'}
							type={'number'}
						/>
						<TextField
							label={'Usage Limit'}
							value={formData.limit}
							onChange={(e) => setFormData((p) => ({ ...p, limit: e.target.value }))}
							size={'small'}
							type={'number'}
						/>
						<TextField
							label={'Expiry Date'}
							value={formData.expiry}
							onChange={(e) => setFormData((p) => ({ ...p, expiry: e.target.value }))}
							size={'small'}
							type={'date'}
							InputLabelProps={{ shrink: true }}
						/>
					</Box>
					<Stack direction={'row'} justifyContent={'flex-end'} spacing={2} sx={{ mt: '20px' }}>
						<Button className={'btn-cancel'} onClick={() => { setShowCreate(false); setFormData(DEFAULT_FORM); }}>
							Cancel
						</Button>
						<Button
							variant={'contained'}
							className={'btn-add'}
							onClick={createCouponHandler}
							sx={{ background: '#2C1654', '&:hover': { background: '#3D2070' } }}
						>
							Create Coupon
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
										onClick={() => { setTabValue(tab); setPage(0); }}
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
									placeholder={'Search by coupon code'}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => setSearchText('')} />}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<CouponList
							coupons={paginatedCoupons}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateCouponHandler={updateCouponHandler}
							removeCouponHandler={removeCouponHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredCoupons.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminCoupons);
