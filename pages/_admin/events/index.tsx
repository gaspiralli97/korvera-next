import React, { useEffect, useState } from 'react';
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
import { EventList } from '../../../libs/components/admin/events/EventList';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_EVENTS_BY_ADMIN } from '../../../apollo/admin/query';
import { CREATE_EVENT_BY_ADMIN, REMOVE_EVENT_BY_ADMIN, UPDATE_EVENT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { AllEventsInquiry, EventInput } from '../../../libs/types/event/event.input';
import { Event } from '../../../libs/types/event/event';
import { EventCategory, EventStatus } from '../../../libs/enums/event.enum';
import { T } from '../../../libs/types/common';

const EVENT_CATEGORIES = Object.values(EventCategory);

const AdminEvents: NextPage = ({ initialInquiry, ...props }: any) => {
	const [eventsInquiry, setEventsInquiry] = useState<AllEventsInquiry>(initialInquiry);
	const [events, setEvents] = useState<Event[]>([]);
	const [eventsTotal, setEventsTotal] = useState<number>(0);
	const [tabValue, setTabValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState<string>('');
	const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
	const [showForm, setShowForm] = useState<boolean>(false);

	const [formTitle, setFormTitle] = useState<string>('');
	const [formCategory, setFormCategory] = useState<string>(EventCategory.SKINCARE);
	const [formDescription, setFormDescription] = useState<string>('');
	const [formImage, setFormImage] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [createEventByAdmin] = useMutation(CREATE_EVENT_BY_ADMIN);
	const [updateEventByAdmin] = useMutation(UPDATE_EVENT_BY_ADMIN);
	const [removeEventByAdmin] = useMutation(REMOVE_EVENT_BY_ADMIN);

	const {
		loading,
		data,
		error,
		refetch: refetchEvents,
	} = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: eventsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEvents(data?.getAllEventsByAdmin?.list ?? []);
			setEventsTotal(data?.getAllEventsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		refetchEvents({ input: eventsInquiry }).then();
	}, [eventsInquiry]);

	/** HANDLERS **/
	const resetForm = () => {
		setFormTitle('');
		setFormCategory(EventCategory.SKINCARE);
		setFormDescription('');
		setFormImage('');
	};

	const handleAddToggle = () => {
		if (showForm) resetForm();
		setShowForm((prev) => !prev);
	};

	const handleSaveEvent = async () => {
		if (!formTitle.trim() || !formDescription.trim()) return;
		try {
			const input: EventInput = {
				eventTitle: formTitle.trim(),
				eventCategory: formCategory as EventCategory,
				eventDescription: formDescription.trim(),
				eventImage: formImage.trim() || undefined,
			};
			await createEventByAdmin({ variables: { input } });
			await refetchEvents({ input: eventsInquiry });
			resetForm();
			setShowForm(false);
			await sweetTopSuccessAlert('Event created successfully!');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const statusChangeHandler = async (id: string, status: string) => {
		try {
			await updateEventByAdmin({ variables: { input: { _id: id, eventStatus: status as EventStatus } } });
			await refetchEvents({ input: eventsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const deleteHandler = async (id: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Are you sure you want to delete this event?');
			if (confirmed) {
				await removeEventByAdmin({ variables: { input: id } });
				await refetchEvents({ input: eventsInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const handleTabChange = (tab: string) => {
		setTabValue(tab);
		const newInquiry = { ...eventsInquiry, page: 1, search: { ...eventsInquiry.search } };
		if (tab !== 'ALL') {
			newInquiry.search.eventStatus = tab as EventStatus;
		} else {
			delete newInquiry.search.eventStatus;
		}
		setEventsInquiry(newInquiry);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const handleClearSearch = () => {
		setSearchText('');
		const newInquiry = { ...eventsInquiry, page: 1, search: { ...eventsInquiry.search } };
		delete newInquiry.search.text;
		setEventsInquiry(newInquiry);
	};

	const handleSearchSubmit = () => {
		const newInquiry = { ...eventsInquiry, page: 1, search: { ...eventsInquiry.search } };
		if (searchText.trim()) {
			newInquiry.search.text = searchText.trim();
		} else {
			delete newInquiry.search.text;
		}
		setEventsInquiry(newInquiry);
	};

	const changePageHandler = (event: unknown, newPage: number) => {
		setEventsInquiry({ ...eventsInquiry, page: newPage + 1 });
	};

	const changeRowsPerPageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEventsInquiry({ ...eventsInquiry, limit: parseInt(e.target.value, 10), page: 1 });
	};

	const isSaveDisabled = !formTitle.trim() || !formDescription.trim();

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'}>
					<Typography variant={'h2'}>Event Management</Typography>
					<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mt: '4px' }}>
						Create and manage promotional events
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
						Create New Event
					</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Title'}
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							size={'small'}
							fullWidth
							placeholder={'Enter event title'}
						/>
						<Select
							value={formCategory}
							onChange={(e: SelectChangeEvent) => setFormCategory(e.target.value)}
							size={'small'}
							fullWidth
						>
							{EVENT_CATEGORIES.map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat.charAt(0) + cat.slice(1).toLowerCase()}
								</MenuItem>
							))}
						</Select>
					</Box>
					<Box component={'div'} sx={{ mt: '16px' }}>
						<TextField
							label={'Description'}
							value={formDescription}
							onChange={(e) => setFormDescription(e.target.value)}
							size={'small'}
							fullWidth
							multiline
							rows={4}
							placeholder={'Enter event description'}
						/>
					</Box>
					<TextField
						label={'Event Image URL (optional)'}
						value={formImage}
						onChange={(e) => setFormImage(e.target.value)}
						size={'small'}
						fullWidth
						placeholder={'e.g. https://example.com/event-image.jpg'}
					/>
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
							onClick={handleSaveEvent}
							disabled={isSaveDisabled}
							sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
						>
							Save Event
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
									All ({eventsTotal})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('ACTIVE')}
									className={tabValue === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('INACTIVE')}
									className={tabValue === 'INACTIVE' ? 'li on' : 'li'}
								>
									Inactive
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={handleSearchChange}
									onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by event title'}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon onClick={handleClearSearch} sx={{ cursor: 'pointer' }} />}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
								<Select
									sx={{ width: '160px', ml: '20px' }}
									value={categoryFilter}
									onChange={(e: SelectChangeEvent) => {
										const val = e.target.value;
										setCategoryFilter(val);
										const newInquiry = { ...eventsInquiry, page: 1, search: { ...eventsInquiry.search } };
										if (val !== 'ALL') {
											newInquiry.search.eventCategory = val as EventCategory;
										} else {
											delete newInquiry.search.eventCategory;
										}
										setEventsInquiry(newInquiry);
									}}
								>
									<MenuItem value={'ALL'}>All Categories</MenuItem>
									{EVENT_CATEGORIES.map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat.charAt(0) + cat.slice(1).toLowerCase()}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>

						<EventList
							events={events}
							onStatusChange={statusChangeHandler}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={eventsTotal}
							rowsPerPage={eventsInquiry.limit}
							page={eventsInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminEvents.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminEvents);
