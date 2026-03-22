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
	title: string;
	writer: string;
	date: string;
	status: string;
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
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
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

interface FaqArticlesPanelListType {
	dense?: boolean;
	faqsData: any[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateFaqHandler: any;
	removeFaqHandler: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const {
		dense,
		faqsData,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateFaqHandler,
		removeFaqHandler,
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
						{faqsData.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={5}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{faqsData.length !== 0 &&
							faqsData.map((faq: any, index: number) => (
								<TableRow hover key={faq?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{faq?.noticeCategory}</TableCell>
									<TableCell align="left">{faq?.noticeTitle}</TableCell>
									<TableCell align="left">{faq?.memberData?.memberNick}</TableCell>
									<TableCell align="left">{faq?.createdAt}</TableCell>
									<TableCell align="center">
										{faq?.noticeStatus === NoticeStatus.DELETE && (
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removeFaqHandler(faq._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										)}

										{faq?.noticeStatus !== NoticeStatus.DELETE && (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, index)}
													className={faq?.noticeStatus === NoticeStatus.ACTIVE ? 'badge success' : 'badge warning'}
												>
													{faq?.noticeStatus}
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
														.filter((ele) => ele !== faq?.noticeStatus)
														.map((status: string) => (
															<MenuItem
																onClick={() => updateFaqHandler({ _id: faq._id, noticeStatus: status })}
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
