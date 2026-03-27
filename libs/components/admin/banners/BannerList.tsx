import React from 'react';
import {
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface MockBanner {
	id: string;
	title: string;
	type: string;
	position: number;
	link: string;
	status: string;
}

const getTypeBadge = (type: string) => {
	switch (type) {
		case 'HERO':
			return { cls: 'badge up', label: 'HERO' };
		case 'PROMO':
			return { cls: 'badge success', label: 'PROMO' };
		case 'CATEGORY':
			return { cls: 'badge warning', label: 'CATEGORY' };
		case 'FEATURE':
			return { cls: 'badge block', label: 'FEATURE' };
		default:
			return { cls: 'badge success', label: type };
	}
};

const headCells = [
	{ id: 'id', label: 'ID', align: 'left' as const },
	{ id: 'title', label: 'TITLE', align: 'left' as const },
	{ id: 'type', label: 'TYPE', align: 'center' as const },
	{ id: 'position', label: 'POSITION', align: 'center' as const },
	{ id: 'link', label: 'TARGET LINK', align: 'left' as const },
	{ id: 'status', label: 'ACTIVE', align: 'center' as const },
	{ id: 'actions', label: 'ACTIONS', align: 'center' as const },
];

interface BannerListProps {
	banners: MockBanner[];
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
}

export const BannerList = (props: BannerListProps) => {
	const { banners, onToggle, onDelete } = props;

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
						{banners.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>No banners found</span>
								</TableCell>
							</TableRow>
						)}
						{banners.length !== 0 &&
							banners.map((banner: MockBanner) => {
								const typeBadge = getTypeBadge(banner.type);
								return (
									<TableRow hover key={banner.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Typography variant={'subtitle1'} sx={{ fontWeight: 600, color: '#1A1A2E', fontSize: '12px' }}>
												{banner.id}
											</Typography>
										</TableCell>

										<TableCell align="left">
											<Typography
												variant={'subtitle1'}
												sx={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E', maxWidth: '220px' }}
												noWrap
											>
												{banner.title}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<span className={typeBadge.cls}>{typeBadge.label}</span>
										</TableCell>

										<TableCell align="center">
											<Typography
												variant={'subtitle1'}
												sx={{
													width: '28px',
													height: '28px',
													borderRadius: '50%',
													background: '#2C1654',
													color: '#fff',
													display: 'inline-flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: '12px',
													fontWeight: 700,
												}}
											>
												{banner.position}
											</Typography>
										</TableCell>

										<TableCell align="left">
											<Typography
												variant={'subtitle1'}
												sx={{ color: '#2C1654', fontSize: '12px', fontFamily: 'monospace', maxWidth: '180px' }}
												noWrap
											>
												{banner.link}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Switch
												checked={banner.status === 'ACTIVE'}
												onChange={() => onToggle(banner.id)}
												size={'small'}
												sx={{
													'& .MuiSwitch-switchBase.Mui-checked': { color: '#2C1654' },
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2C1654' },
												}}
											/>
										</TableCell>

										<TableCell align="center">
											<IconButton
												size={'small'}
												onClick={() => onDelete(banner.id)}
												sx={{ color: '#C0504A', '&:hover': { background: 'rgba(192, 80, 74, 0.08)' } }}
											>
												<DeleteOutlineIcon fontSize={'small'} />
											</IconButton>
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
