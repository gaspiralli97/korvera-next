import React from 'react';
import {
	Box,
	Button,
	Fade,
	Menu,
	MenuItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export interface MockBrand {
	id: string;
	brandName: string;
	sellerNick: string;
	sellerEmail: string;
	products: number;
	revenue: string;
	joinDate: string;
	status: string;
}

const BRAND_STATUSES = ['ACTIVE', 'BLOCK', 'DELETE'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'ACTIVE': return 'success';
		case 'PENDING': return 'warning';
		case 'BLOCK': return 'block';
		case 'DELETE': return 'delete';
		default: return 'success';
	}
};

interface HeadCell {
	id: string;
	label: string;
	align: 'left' | 'center' | 'right';
}

const headCells: readonly HeadCell[] = [
	{ id: 'id', label: 'BRAND ID', align: 'left' },
	{ id: 'brand', label: 'BRAND / SELLER', align: 'left' },
	{ id: 'products', label: 'PRODUCTS', align: 'center' },
	{ id: 'revenue', label: 'REVENUE', align: 'center' },
	{ id: 'joined', label: 'JOINED', align: 'center' },
	{ id: 'status', label: 'STATUS', align: 'center' },
	{ id: 'actions', label: 'ACTIONS', align: 'center' },
];

interface BrandListProps {
	brands: MockBrand[];
	anchorEl: any;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	approveHandler: (id: string) => void;
	rejectHandler: (id: string) => void;
	updateStatusHandler: (id: string, status: string) => void;
}

export const BrandList = (props: BrandListProps) => {
	const {
		brands,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		approveHandler,
		rejectHandler,
		updateStatusHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<TableHead>
						<TableRow>
							{headCells.map((cell) => (
								<TableCell key={cell.id} align={cell.align} padding={'normal'}>
									{cell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{brands.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>No brands found</span>
								</TableCell>
							</TableRow>
						)}

						{brands.length !== 0 &&
							brands.map((brand: MockBrand) => (
								<TableRow hover key={brand.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px' }}
										>
											{brand.id}
										</Typography>
									</TableCell>

									<TableCell align="left" className={'name'}>
										<Stack direction={'row'} alignItems={'center'} spacing={1.5}>
											<Avatar
												src={'/img/profile/defaultUser.svg'}
												sx={{ width: 36, height: 36 }}
											/>
											<Box component={'div'}>
												<Typography
													variant={'subtitle1'}
													sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px', lineHeight: 1.3 }}
												>
													{brand.brandName}
												</Typography>
												<Typography
													variant={'body2'}
													sx={{ color: '#8A8A9A', fontSize: '11px' }}
												>
													@{brand.sellerNick} · {brand.sellerEmail}
												</Typography>
											</Box>
										</Stack>
									</TableCell>

									<TableCell align="center">
										<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '13px' }}>
											{brand.products}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '13px' }}
										>
											{brand.revenue}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{brand.joinDate}
										</Typography>
									</TableCell>

									<TableCell align="center">
										{brand.status === 'PENDING' ? (
											<Button className={'badge warning'} disabled>
												PENDING
											</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, brand.id)}
													className={`badge ${getStatusClass(brand.status)}`}
												>
													{brand.status}
												</Button>

												<Menu
													className={'menu-modal'}
													MenuListProps={{ 'aria-labelledby': 'fade-button' }}
													anchorEl={anchorEl[brand.id]}
													open={Boolean(anchorEl[brand.id])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{BRAND_STATUSES.filter((s) => s !== brand.status).map((status) => (
														<MenuItem
															key={status}
															onClick={() => updateStatusHandler(brand.id, status)}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
												</Menu>
											</>
										)}
									</TableCell>

									<TableCell align="center">
										{brand.status === 'PENDING' ? (
											<Stack direction={'row'} spacing={1} justifyContent={'center'}>
												<Button
													size={'small'}
													onClick={() => approveHandler(brand.id)}
													sx={{
														minWidth: '32px',
														height: '32px',
														p: '4px',
														background: 'rgba(74,155,111,0.1)',
														color: '#4A9B6F',
														borderRadius: '8px',
														'&:hover': { background: '#4A9B6F', color: '#fff' },
													}}
												>
													<CheckIcon fontSize={'small'} />
												</Button>
												<Button
													size={'small'}
													onClick={() => rejectHandler(brand.id)}
													sx={{
														minWidth: '32px',
														height: '32px',
														p: '4px',
														background: 'rgba(192,80,74,0.1)',
														color: '#C0504A',
														borderRadius: '8px',
														'&:hover': { background: '#C0504A', color: '#fff' },
													}}
												>
													<CloseIcon fontSize={'small'} />
												</Button>
											</Stack>
										) : (
											<Typography variant={'body2'} sx={{ color: '#C8C8D0', fontSize: '12px' }}>
												—
											</Typography>
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
