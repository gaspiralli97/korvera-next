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
import { EventList, MockEvent } from '../../../libs/components/admin/events/EventList';
import { sweetConfirmAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const initialEvents: MockEvent[] = [
	{
		id: 'evt-001',
		title: 'Spring Skincare Glow Event',
		category: 'SKINCARE',
		description:
			'Celebrate spring with exclusive discounts on our top-rated serums, moisturizers, and SPF essentials. Up to 35% off selected skincare brands throughout the month of March.',
		status: 'ACTIVE',
		createdAt: '2026-01-10',
	},
	{
		id: 'evt-002',
		title: 'Bold Looks Makeup Festival',
		category: 'MAKEUP',
		description:
			'Get ready for the season with our curated makeup collection event. Discover new shades, limited-edition palettes, and exclusive bundle offers from top cosmetics brands.',
		status: 'ACTIVE',
		createdAt: '2026-01-15',
	},
	{
		id: 'evt-003',
		title: 'Healthy Hair Haircare Week',
		category: 'HAIRCARE',
		description:
			'A week-long celebration of healthy hair featuring professional haircare brands. Enjoy buy-one-get-one deals on shampoos, conditioners, and treatment masks.',
		status: 'ACTIVE',
		createdAt: '2026-01-20',
	},
	{
		id: 'evt-004',
		title: 'Mind & Body Wellness Campaign',
		category: 'WELLNESS',
		description:
			'Promote inner balance with our curated wellness lineup. Featuring aromatherapy, bath rituals, and supplement collections to support a holistic beauty routine.',
		status: 'ACTIVE',
		createdAt: '2026-01-25',
	},
	{
		id: 'evt-005',
		title: 'Signature Scent Fragrance Launch',
		category: 'FRAGRANCE',
		description:
			'Explore a curated selection of luxury and indie fragrances in our seasonal launch event. Free scent samples with every order over $60 throughout the campaign period.',
		status: 'ACTIVE',
		createdAt: '2026-02-01',
	},
	{
		id: 'evt-006',
		title: 'Pamper Yourself Body Care Weekend',
		category: 'BODYCARE',
		description:
			'Indulge in premium body care with weekend-only flash deals. From exfoliating scrubs to nourishing body oils, find everything you need for a spa-like experience at home.',
		status: 'INACTIVE',
		createdAt: '2026-02-10',
	},
];

const EVENT_CATEGORIES = ['SKINCARE', 'MAKEUP', 'HAIRCARE', 'WELLNESS', 'FRAGRANCE', 'BODYCARE'];

const AdminEvents: NextPage = (props: any) => {
	const [events, setEvents] = useState<MockEvent[]>(initialEvents);
	const [tabValue, setTabValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState<string>('');
	const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
	const [showForm, setShowForm] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const [formTitle, setFormTitle] = useState<string>('');
	const [formCategory, setFormCategory] = useState<string>('SKINCARE');
	const [formDescription, setFormDescription] = useState<string>('');
	const [formImage, setFormImage] = useState<string>('');

	/** HANDLERS **/

	const resetForm = () => {
		setFormTitle('');
		setFormCategory('SKINCARE');
		setFormDescription('');
		setFormImage('');
	};

	const handleAddToggle = () => {
		if (showForm) {
			resetForm();
		}
		setShowForm((prev) => !prev);
	};

	const handleSaveEvent = async () => {
		if (!formTitle.trim() || !formDescription.trim()) return;

		const newEvent: MockEvent = {
			id: `evt-${Date.now()}`,
			title: formTitle.trim(),
			category: formCategory,
			description: formDescription.trim(),
			image: formImage.trim(),
			status: 'ACTIVE',
			createdAt: new Date().toISOString().split('T')[0],
		};

		setEvents((prev) => [newEvent, ...prev]);
		resetForm();
		setShowForm(false);
		await sweetTopSuccessAlert('Event created successfully!');
	};

	const statusChangeHandler = (id: string, status: string) => {
		setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status } : event)));
	};

	const deleteHandler = async (id: string) => {
		const confirmed = await sweetConfirmAlert('Are you sure you want to delete this event?');
		if (confirmed) {
			setEvents((prev) => prev.filter((event) => event.id !== id));
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

	/** FILTERING **/

	const filteredEvents = events.filter((event) => {
		const matchesTab =
			tabValue === 'ALL' ||
			(tabValue === 'ACTIVE' && event.status === 'ACTIVE') ||
			(tabValue === 'INACTIVE' && event.status === 'INACTIVE');

		const matchesCategory = categoryFilter === 'ALL' || event.category === categoryFilter;

		const matchesSearch =
			!searchText.trim() || event.title.toLowerCase().includes(searchText.toLowerCase());

		return matchesTab && matchesCategory && matchesSearch;
	});

	const paginatedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const activeCount = events.filter((e) => e.status === 'ACTIVE').length;
	const inactiveCount = events.filter((e) => e.status === 'INACTIVE').length;

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
									All ({events.length})
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
										setCategoryFilter(e.target.value);
										setPage(0);
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
							events={paginatedEvents}
							onStatusChange={statusChangeHandler}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredEvents.length}
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

export default withAdminLayout(AdminEvents);
