import React from 'react';
import { useRouter } from 'next/router';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Box,
	Checkbox,
	Toolbar,
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';

type Order = 'asc' | 'desc';

interface Data {
	category: string;
	title: string;
	id: string;
	writer: string;
	date: string;
	view: number;
	action: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},
	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'WRITER',
	},
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'view',
		numeric: true,
		disablePadding: false,
		label: 'VIEW',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const { onSelectAllClick, numSelected, rowCount } = props;

	return (
		<>
			{numSelected > 0 ? (
				<Toolbar>
					<Box component={'div'}>
						<Box component={'div'} className="flex_box">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
							<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="h6" component="div">
								{numSelected} selected
							</Typography>
						</Box>
						<Button variant={'text'} size={'large'}>
							Delete
						</Button>
					</Box>
				</Toolbar>
			) : (
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
						</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								align={headCell.numeric ? 'left' : 'right'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
							>
								{headCell.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
			)}
		</>
	);
};

interface NoticeListType {
	dense?: boolean;
	noticesData: any[];
	removeNoticeHandler: any;
}

export const NoticeList = (props: NoticeListType) => {
	const { dense, noticesData, removeNoticeHandler } = props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableToolbar />
					<TableBody>
						{noticesData.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{noticesData.length !== 0 &&
							noticesData.map((notice: any) => (
								<TableRow hover key={notice?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell padding="checkbox">
										<Checkbox color="primary" />
									</TableCell>
									<TableCell align="left">{notice?.noticeCategory}</TableCell>
									<TableCell align="left">{notice?.noticeTitle}</TableCell>
									<TableCell align="left">{notice?._id}</TableCell>
									<TableCell align="left">{notice?.memberData?.memberNick}</TableCell>
									<TableCell align="left">{notice?.createdAt}</TableCell>
									<TableCell align="left">{notice?.noticeViews ?? 0}</TableCell>
									<TableCell align="right">
										<Tooltip title={'delete'}>
											<IconButton onClick={() => removeNoticeHandler(notice._id)}>
												<DeleteRoundedIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="edit">
											<IconButton onClick={() => router.push(`/_admin/cs/notice_create?id=${notice._id}`)}>
												<NotePencil size={24} weight="fill" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
