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
import Avatar from '@mui/material/Avatar';

export interface MockPayout {
	id: string;
	seller: string;
	sellerNick: string;
	amount: string;
	method: string;
	requestedDate: string;
	status: string;
}

const PAYOUT_STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'PENDING': return 'warning';
		case 'PROCESSING': return 'up';
		case 'COMPLETED': return 'success';
		case 'REJECTED': return 'error';
		default: return 'warning';
	}
};

const getMethodBadge = (method: string) => {
	switch (method) {
		case 'Bank Transfer': return { bg: 'rgba(44,22,84,0.08)', color: '#2C1654' };
		case 'PayPal': return { bg: 'rgba(74,155,111,0.1)', color: '#4A9B6F' };
		case 'Stripe': return { bg: 'rgba(99,91,255,0.1)', color: '#635BFF' };
		default: return { bg: 'rgba(44,22,84,0.08)', color: '#2C1654' };
	}
};

const headCells = [
	{ id: 'id', label: 'PAYOUT ID', align: 'left' as const },
	{ id: 'seller', label: 'SELLER', align: 'left' as const },
	{ id: 'amount', label: 'AMOUNT', align: 'center' as const },
	{ id: 'method', label: 'METHOD', align: 'center' as const },
	{ id: 'date', label: 'REQUESTED', align: 'center' as const },
	{ id: 'status', label: 'STATUS', align: 'center' as const },
];

interface PayoutListProps {
	payouts: MockPayout[];
	anchorEl: Record<string, HTMLElement | null>;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	updatePayoutHandler: (id: string, status: string) => void;
}

export const PayoutList = (props: PayoutListProps) => {
	const { payouts, anchorEl, menuIconClickHandler, menuIconCloseHandler, updatePayoutHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size={'medium'}>
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
						{payouts.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>No payout requests found</span>
								</TableCell>
							</TableRow>
						)}
						{payouts.length !== 0 &&
							payouts.map((payout: MockPayout) => {
								const methodStyle = getMethodBadge(payout.method);
								return (
									<TableRow hover key={payout.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '12px' }}>
												{payout.id}
											</Typography>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'} alignItems={'center'} spacing={1.2}>
												<Avatar src={'/img/profile/defaultUser.svg'} sx={{ width: 32, height: 32 }} />
												<Stack>
													<Typography variant={'subtitle1'} sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
														{payout.seller}
													</Typography>
													<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
														@{payout.sellerNick}
													</Typography>
												</Stack>
											</Stack>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '15px' }}>
												{payout.amount}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography
												variant={'subtitle1'}
												sx={{
													px: '10px',
													py: '3px',
													borderRadius: '20px',
													background: methodStyle.bg,
													color: methodStyle.color,
													fontSize: '11px',
													fontWeight: 600,
													display: 'inline-block',
												}}
											>
												{payout.method}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
												{payout.requestedDate}
											</Typography>
										</TableCell>

										<TableCell align="center">
											{payout.status === 'COMPLETED' ? (
												<Button className={'badge success'} disabled>{payout.status}</Button>
											) : (
												<>
													<Button
														onClick={(e: any) => menuIconClickHandler(e, payout.id)}
														className={`badge ${getStatusClass(payout.status)}`}
													>
														{payout.status}
													</Button>
													<Menu
														className={'menu-modal'}
														MenuListProps={{ 'aria-labelledby': 'fade-button' }}
														anchorEl={anchorEl[payout.id]}
														open={Boolean(anchorEl[payout.id])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{PAYOUT_STATUSES.filter((s) => s !== payout.status).map((status) => (
															<MenuItem key={status} onClick={() => updatePayoutHandler(payout.id, status)}>
																<Typography variant={'subtitle1'} component={'span'}>{status}</Typography>
															</MenuItem>
														))}
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
