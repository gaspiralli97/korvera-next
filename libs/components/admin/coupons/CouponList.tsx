import React from 'react';
import {
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

export interface MockCoupon {
	id: string;
	code: string;
	type: string;
	discount: string;
	minOrder: string;
	usage: string;
	expiry: string;
	status: string;
}

const COUPON_STATUSES = ['ACTIVE', 'DISABLED'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'ACTIVE': return 'success';
		case 'EXPIRED': return 'error';
		case 'DISABLED': return 'inactive';
		default: return 'success';
	}
};

const getTypeStyle = (type: string) => {
	return type === 'PERCENT'
		? { bg: 'rgba(44,22,84,0.08)', color: '#2C1654', label: '%' }
		: { bg: 'rgba(201,166,128,0.15)', color: '#8B6914', label: '$' };
};

const headCells = [
	{ id: 'code', label: 'CODE', align: 'left' as const },
	{ id: 'type', label: 'TYPE', align: 'center' as const },
	{ id: 'discount', label: 'DISCOUNT', align: 'center' as const },
	{ id: 'minOrder', label: 'MIN ORDER', align: 'center' as const },
	{ id: 'usage', label: 'USED / LIMIT', align: 'center' as const },
	{ id: 'expiry', label: 'EXPIRY', align: 'center' as const },
	{ id: 'status', label: 'STATUS', align: 'center' as const },
];

interface CouponListProps {
	coupons: MockCoupon[];
	anchorEl: Record<string, HTMLElement | null>;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	updateCouponHandler: (id: string, status: string) => void;
	removeCouponHandler: (id: string) => void;
}

export const CouponList = (props: CouponListProps) => {
	const { coupons, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateCouponHandler, removeCouponHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 700 }} aria-labelledby="tableTitle" size={'medium'}>
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
						{coupons.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>No coupons found</span>
								</TableCell>
							</TableRow>
						)}
						{coupons.length !== 0 &&
							coupons.map((coupon: MockCoupon) => {
								const typeStyle = getTypeStyle(coupon.type);
								return (
									<TableRow hover key={coupon.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Typography
												variant={'subtitle1'}
												sx={{
													fontWeight: 700,
													fontSize: '14px',
													color: '#1A1A2E',
													fontFamily: 'monospace',
													letterSpacing: '1.5px',
													background: '#F5F0FA',
													px: '8px',
													py: '3px',
													borderRadius: '4px',
													display: 'inline-block',
												}}
											>
												{coupon.code}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography
												variant={'subtitle1'}
												sx={{
													px: '8px', py: '2px',
													borderRadius: '12px',
													background: typeStyle.bg,
													color: typeStyle.color,
													fontSize: '11px',
													fontWeight: 700,
													display: 'inline-block',
												}}
											>
												{typeStyle.label} {coupon.type}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ fontWeight: 700, fontSize: '15px', color: '#2C1654' }}>
												{coupon.discount}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '13px' }}>
												{coupon.minOrder}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '13px', fontFamily: 'monospace' }}>
												{coupon.usage}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
												{coupon.expiry}
											</Typography>
										</TableCell>

										<TableCell align="center">
											{coupon.status === 'EXPIRED' ? (
												<Button className={'badge error'} disabled>EXPIRED</Button>
											) : (
												<>
													<Button
														onClick={(e: any) => menuIconClickHandler(e, coupon.id)}
														className={`badge ${getStatusClass(coupon.status)}`}
													>
														{coupon.status}
													</Button>
													<Menu
														className={'menu-modal'}
														MenuListProps={{ 'aria-labelledby': 'fade-button' }}
														anchorEl={anchorEl[coupon.id]}
														open={Boolean(anchorEl[coupon.id])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{COUPON_STATUSES.filter((s) => s !== coupon.status).map((status) => (
															<MenuItem key={status} onClick={() => updateCouponHandler(coupon.id, status)}>
																<Typography variant={'subtitle1'} component={'span'}>{status}</Typography>
															</MenuItem>
														))}
														<MenuItem onClick={() => removeCouponHandler(coupon.id)}>
															<Typography variant={'subtitle1'} component={'span'} sx={{ color: '#C0504A' }}>
																Delete
															</Typography>
														</MenuItem>
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
