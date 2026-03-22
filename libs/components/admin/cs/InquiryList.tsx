import React from 'react';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { NoticeStatus } from '../../../enums/notice.enum';
import DeleteIcon from '@mui/icons-material/Delete';

interface Data {
	category: string;
	qna_case_status: string;
	title: string;
	writer: string;
	date: string;
}

type Order = 'asc' | 'desc';

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
		id: 'qna_case_status',
		numeric: false,
		disablePadding: false,
		label: 'QNA STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface InquiryListType {
	dense?: boolean;
	inquiriesData: any[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateInquiryHandler: any;
	removeInquiryHandler: any;
}

export const InquiryList = (props: InquiryListType) => {
	const {
		dense,
		inquiriesData,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateInquiryHandler,
		removeInquiryHandler,
	} = props;

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{inquiriesData.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={5}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{inquiriesData.length !== 0 &&
							inquiriesData.map((inquiry: any, index: number) => (
								<TableRow hover key={inquiry?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{inquiry?.noticeCategory}</TableCell>
									<TableCell align="left">{inquiry?.noticeTitle}</TableCell>
									<TableCell align="left">{inquiry?.memberData?.memberNick}</TableCell>
									<TableCell align="left">{inquiry?.createdAt}</TableCell>
									<TableCell align="center">
										{inquiry?.noticeStatus === NoticeStatus.DELETE && (
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removeInquiryHandler(inquiry._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										)}

										{inquiry?.noticeStatus !== NoticeStatus.DELETE && (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, index)}
													className={inquiry?.noticeStatus === NoticeStatus.ACTIVE ? 'badge success' : 'badge warning'}
												>
													{inquiry?.noticeStatus}
												</Button>

												<Menu
													className={'menu-modal'}
													MenuListProps={{
														'aria-labelledby': 'fade-button',
													}}
													anchorEl={anchorEl[index]}
													open={Boolean(anchorEl[index])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{Object.values(NoticeStatus)
														.filter((ele) => ele !== inquiry?.noticeStatus)
														.map((status: string) => (
															<MenuItem
																onClick={() => updateInquiryHandler({ _id: inquiry._id, noticeStatus: status })}
																key={status}
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
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
