import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	Collapse,
	Divider,
	InputAdornment,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { List, ListItem } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { TabContext } from '@mui/lab';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_NOTICES_BY_ADMIN } from '../../../apollo/admin/query';
import {
	CREATE_NOTICE_BY_ADMIN,
	REMOVE_NOTICE_BY_ADMIN,
	UPDATE_NOTICE_BY_ADMIN,
} from '../../../apollo/admin/mutation';

const AdminNotice: NextPage = (props: any) => {
	const [tabValue, setTabValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState<string>('');
	const [showForm, setShowForm] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const [formTitle, setFormTitle] = useState<string>('');
	const [formPriority, setFormPriority] = useState<string>('MEDIUM');
	const [formContent, setFormContent] = useState<string>('');

	/** APOLLO **/

	const { data, refetch } = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 100,
				search: {
					noticeCategory: 'ANNOUNCEMENT',
					...(tabValue !== 'ALL' && { noticeStatus: tabValue === 'ACTIVE' ? 'ACTIVE' : 'HOLD' }),
					...(searchText && { text: searchText }),
				},
			},
		},
	});

	const [createNoticeByAdmin] = useMutation(CREATE_NOTICE_BY_ADMIN);
	const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const notices = data?.getAllNoticesByAdmin?.list ?? [];

	/** HANDLERS **/

	const resetForm = () => {
		setFormTitle('');
		setFormPriority('MEDIUM');
		setFormContent('');
	};

	const handleAddToggle = () => {
		if (showForm) {
			resetForm();
		}
		setShowForm((prev) => !prev);
	};

	const handleSaveNotice = async () => {
		if (!formTitle.trim() || !formContent.trim()) return;

		try {
			await createNoticeByAdmin({
				variables: {
					input: {
						noticeCategory: 'ANNOUNCEMENT',
						noticePriority: formPriority,
						noticeTitle: formTitle.trim(),
						noticeContent: formContent.trim(),
					},
				},
			});
			resetForm();
			setShowForm(false);
			await refetch();
			await sweetTopSuccessAlert('Notice posted successfully!');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const statusChangeHandler = async (id: string, status: string) => {
		try {
			await updateNoticeByAdmin({
				variables: {
					input: {
						_id: id,
						noticeStatus: status === 'ACTIVE' ? 'ACTIVE' : 'HOLD',
					},
				},
			});
			await refetch();
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const deleteHandler = async (id: string) => {
		const confirmed = await sweetConfirmAlert('Are you sure you want to delete this notice?');
		if (confirmed) {
			try {
				await removeNoticeByAdmin({ variables: { input: id } });
				await refetch();
			} catch (err: any) {
				await sweetErrorHandling(err);
			}
		}
	};

	const handleTabChange = (tab: string) => {
		setTabValue(tab);
		setPage(0);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		setPage(0);
	};

	const handleClearSearch = () => {
		setSearchText('');
		setPage(0);
	};

	const handlePageChange = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	/** VIEW **/

	const mappedNotices = notices.map((n: any) => ({
		id: n._id,
		title: n.noticeTitle,
		priority: n.noticePriority ?? 'MEDIUM',
		content: n.noticeContent,
		views: n.noticeViews,
		status: n.noticeStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
		createdAt: n.createdAt ? new Date(n.createdAt).toISOString().split('T')[0] : '',
	}));

	const filteredNotices = mappedNotices.filter((notice: any) => {
		const matchesTab =
			tabValue === 'ALL' ||
			(tabValue === 'ACTIVE' && notice.status === 'ACTIVE') ||
			(tabValue === 'INACTIVE' && notice.status === 'INACTIVE');

		const matchesSearch =
			!searchText.trim() || notice.title.toLowerCase().includes(searchText.toLowerCase());

		return matchesTab && matchesSearch;
	});

	const paginatedNotices = filteredNotices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const activeCount = mappedNotices.filter((n: any) => n.status === 'ACTIVE').length;
	const inactiveCount = mappedNotices.filter((n: any) => n.status === 'INACTIVE').length;

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'}>
					<Typography variant={'h2'}>Notice Management</Typography>
					<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mt: '4px' }}>
						Post and manage platform announcements
					</Typography>
				</Box>
				<Button
					variant={'contained'}
					size={'medium'}
					onClick={handleAddToggle}
					sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					{showForm ? 'CANCEL' : 'ADD'}
				</Button>
			</Box>

			<Collapse in={showForm}>
				<Box component={'div'} className={'chart-card'} sx={{ mb: '24px' }}>
					<Typography className={'chart-section-title'} sx={{ mb: '20px' }}>
						Create New Notice
					</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Title'}
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							size={'small'}
							fullWidth
							placeholder={'Enter notice title'}
						/>
						<Select
							value={formPriority}
							onChange={(e: SelectChangeEvent) => setFormPriority(e.target.value)}
							size={'small'}
							fullWidth
						>
							<MenuItem value={'HIGH'}>HIGH</MenuItem>
							<MenuItem value={'MEDIUM'}>MEDIUM</MenuItem>
							<MenuItem value={'LOW'}>LOW</MenuItem>
						</Select>
					</Box>
					<Box component={'div'} sx={{ mt: '16px' }}>
						<TextField
							label={'Content'}
							value={formContent}
							onChange={(e) => setFormContent(e.target.value)}
							size={'small'}
							fullWidth
							multiline
							rows={4}
							placeholder={'Enter notice content'}
						/>
					</Box>
					<Stack direction={'row'} spacing={'12px'} sx={{ mt: '20px', justifyContent: 'flex-end' }}>
						<Button
							variant={'outlined'}
							size={'medium'}
							onClick={() => {
								resetForm();
								setShowForm(false);
							}}
						>
							Cancel
						</Button>
						<Button
							variant={'contained'}
							size={'medium'}
							onClick={handleSaveNotice}
							sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
						>
							Save Notice
						</Button>
					</Stack>
				</Box>
			</Collapse>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={tabValue}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={() => handleTabChange('ALL')}
									className={tabValue === 'ALL' ? 'li on' : 'li'}
								>
									All ({mappedNotices.length})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('ACTIVE')}
									className={tabValue === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active ({activeCount})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('INACTIVE')}
									className={tabValue === 'INACTIVE' ? 'li on' : 'li'}
								>
									Inactive ({inactiveCount})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={handleSearchChange}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by title'}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon onClick={handleClearSearch} sx={{ cursor: 'pointer' }} />}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<NoticeList
							notices={paginatedNotices}
							onStatusChange={statusChangeHandler}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredNotices.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handlePageChange}
							onRowsPerPageChange={handleRowsPerPageChange}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminNotice);
