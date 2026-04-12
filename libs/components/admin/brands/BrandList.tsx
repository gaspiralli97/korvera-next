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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Brand } from '../../../types/brand/brand';
import { BrandStatus } from '../../../enums/brand.enum';

const BRAND_STATUSES: BrandStatus[] = [BrandStatus.ACTIVE, BrandStatus.INACTIVE];

const getStatusClass = (status: BrandStatus) => {
	switch (status) {
		case BrandStatus.ACTIVE: return 'success';
		case BrandStatus.INACTIVE: return 'inactive';
		case BrandStatus.PENDING: return 'warning';
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
	{ id: 'brand', label: 'BRAND NAME', align: 'left' },
	{ id: 'status', label: 'STATUS', align: 'center' },
	{ id: 'created', label: 'CREATED', align: 'center' },
	{ id: 'actions', label: 'ACTIONS', align: 'center' },
];

interface BrandListProps {
	brands: Brand[];
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
								<TableCell align="center" colSpan={5}>
									<span className={'no-data'}>No brands found</span>
								</TableCell>
							</TableRow>
						)}

						{brands.length !== 0 &&
							brands.map((brand: Brand) => (
								<TableRow hover key={brand._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">
										<Typography
											variant={'subtitle1'}
											sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px' }}
										>
											{brand._id}
										</Typography>
									</TableCell>

									<TableCell align="left" className={'name'}>
										<Stack direction={'row'} alignItems={'center'} spacing={1.5}>
											{brand.brandImage && (
												<Box
													component={'img'}
													src={brand.brandImage}
													sx={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover' }}
												/>
											)}
											<Typography
												variant={'subtitle1'}
												sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '13px' }}
											>
												{brand.brandTitle}
											</Typography>
										</Stack>
									</TableCell>

									<TableCell align="center">
										{brand.brandStatus === BrandStatus.PENDING ? (
											<Button className={'badge warning'} disabled>
												PENDING
											</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, brand._id)}
													className={`badge ${getStatusClass(brand.brandStatus)}`}
												>
													{brand.brandStatus}
												</Button>

												<Menu
													className={'menu-modal'}
													MenuListProps={{ 'aria-labelledby': 'fade-button' }}
													anchorEl={anchorEl[brand._id]}
													open={Boolean(anchorEl[brand._id])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{BRAND_STATUSES.filter((s) => s !== brand.brandStatus).map((status) => (
														<MenuItem
															key={status}
															onClick={() => updateStatusHandler(brand._id, status)}
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
										<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{new Date(brand.createdAt).toLocaleDateString('en-GB', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											})}
										</Typography>
									</TableCell>

									<TableCell align="center">
										{brand.brandStatus === BrandStatus.PENDING ? (
											<Stack direction={'row'} spacing={1} justifyContent={'center'}>
												<Button
													size={'small'}
													onClick={() => approveHandler(brand._id)}
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
													onClick={() => rejectHandler(brand._id)}
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
