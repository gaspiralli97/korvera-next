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

export interface MockReturn {
	id: string;
	orderId: string;
	customer: string;
	email: string;
	product: string;
	reason: string;
	amount: string;
	date: string;
	status: string;
}

const RETURN_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'];

const getStatusClass = (status: string) => {
	switch (status) {
		case 'PENDING': return 'warning';
		case 'APPROVED': return 'success';
		case 'REJECTED': return 'error';
		case 'REFUNDED': return 'refunded';
		default: return 'warning';
	}
};

const headCells = [
	{ id: 'id', label: 'RETURN ID', align: 'left' as const },
	{ id: 'order', label: 'ORDER', align: 'left' as const },
	{ id: 'customer', label: 'CUSTOMER', align: 'left' as const },
	{ id: 'product', label: 'PRODUCT', align: 'left' as const },
	{ id: 'reason', label: 'REASON', align: 'left' as const },
	{ id: 'amount', label: 'AMOUNT', align: 'center' as const },
	{ id: 'date', label: 'DATE', align: 'center' as const },
	{ id: 'status', label: 'STATUS', align: 'center' as const },
];

interface ReturnListProps {
	returns: MockReturn[];
	anchorEl: Record<string, HTMLElement | null>;
	menuIconClickHandler: (e: any, id: string) => void;
	menuIconCloseHandler: () => void;
	updateReturnHandler: (id: string, status: string) => void;
}

export const ReturnList = (props: ReturnListProps) => {
	const { returns, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateReturnHandler } = props;

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
						{returns.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>No return requests found</span>
								</TableCell>
							</TableRow>
						)}
						{returns.length !== 0 &&
							returns.map((ret: MockReturn) => (
								<TableRow hover key={ret.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '12px' }}>
											{ret.id}
										</Typography>
										<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
											{ret.orderId}
										</Typography>
									</TableCell>

									<TableCell align="left">
										<Typography variant={'subtitle1'} sx={{ color: '#4A4A5A', fontSize: '12px' }}>
											{ret.orderId}
										</Typography>
									</TableCell>

									<TableCell align="left" className={'name'}>
										<Stack direction={'row'} alignItems={'center'} spacing={1.2}>
											<Avatar src={'/img/profile/defaultUser.svg'} sx={{ width: 30, height: 30 }} />
											<Stack>
												<Typography variant={'subtitle1'} sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>
													{ret.customer}
												</Typography>
												<Typography variant={'body2'} sx={{ color: '#8A8A9A', fontSize: '11px' }}>
													{ret.email}
												</Typography>
											</Stack>
										</Stack>
									</TableCell>

									<TableCell align="left" sx={{ maxWidth: '160px' }}>
										<Typography variant={'subtitle1'} sx={{ fontSize: '13px', color: '#1A1A2E' }} noWrap>
											{ret.product}
										</Typography>
									</TableCell>

									<TableCell align="left" sx={{ maxWidth: '160px' }}>
										<Typography variant={'subtitle1'} sx={{ fontSize: '12px', color: '#4A4A5A' }} noWrap>
											{ret.reason}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<Typography variant={'subtitle1'} sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '13px' }}>
											{ret.amount}
										</Typography>
									</TableCell>

									<TableCell align="center">
										<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', fontSize: '12px' }}>
											{ret.date}
										</Typography>
									</TableCell>

									<TableCell align="center">
										{ret.status === 'REFUNDED' ? (
											<Button className={'badge refunded'} disabled>{ret.status}</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, ret.id)}
													className={`badge ${getStatusClass(ret.status)}`}
												>
													{ret.status}
												</Button>
												<Menu
													className={'menu-modal'}
													MenuListProps={{ 'aria-labelledby': 'fade-button' }}
													anchorEl={anchorEl[ret.id]}
													open={Boolean(anchorEl[ret.id])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{RETURN_STATUSES.filter((s) => s !== ret.status).map((status) => (
														<MenuItem key={status} onClick={() => updateReturnHandler(ret.id, status)}>
															<Typography variant={'subtitle1'} component={'span'}>{status}</Typography>
														</MenuItem>
													))}
												</Menu>
											</>
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
