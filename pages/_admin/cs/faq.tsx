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
import { FaqArticlesPanelList, MockFaq } from '../../../libs/components/admin/cs/FaqList';
import { sweetConfirmAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const initialFaqs: MockFaq[] = [
	{
		id: 'faq-001',
		title: 'How do I choose the right moisturizer for my skin type?',
		category: 'SKINCARE',
		content:
			'To choose the right moisturizer, first identify your skin type: oily, dry, combination, or sensitive. For oily skin, use lightweight gel-based moisturizers. For dry skin, opt for richer creams with hyaluronic acid or shea butter.',
		status: 'ACTIVE',
		createdAt: '2026-01-10',
	},
	{
		id: 'faq-002',
		title: 'What is the correct order to apply skincare products?',
		category: 'SKINCARE',
		content:
			'The correct skincare order is: cleanser, toner, serum, eye cream, moisturizer, and sunscreen in the morning. At night, replace sunscreen with a night cream or facial oil.',
		status: 'ACTIVE',
		createdAt: '2026-01-12',
	},
	{
		id: 'faq-003',
		title: 'How do I find my correct foundation shade?',
		category: 'MAKEUP',
		content:
			'Test foundation shades on your jawline in natural light. The right shade should blend seamlessly into your skin without appearing too light or too dark. Consider your undertone: warm, cool, or neutral.',
		status: 'ACTIVE',
		createdAt: '2026-01-15',
	},
	{
		id: 'faq-004',
		title: 'Can I return opened makeup products?',
		category: 'RETURNS',
		content:
			'For hygiene reasons, opened makeup products cannot be returned unless they are defective or damaged upon arrival. Unopened products in original packaging can be returned within 30 days.',
		status: 'ACTIVE',
		createdAt: '2026-01-18',
	},
	{
		id: 'faq-005',
		title: 'How long does standard shipping take?',
		category: 'SHIPPING',
		content:
			'Standard shipping takes 3-7 business days within the country. Express shipping (1-2 business days) is available at checkout for an additional fee. International orders may take 10-21 business days.',
		status: 'ACTIVE',
		createdAt: '2026-01-20',
	},
	{
		id: 'faq-006',
		title: 'How do I track my order?',
		category: 'ORDERS',
		content:
			'Once your order ships, you will receive a confirmation email with a tracking number. You can track your order on the carrier website or in the "My Orders" section of your account.',
		status: 'INACTIVE',
		createdAt: '2026-01-22',
	},
	{
		id: 'faq-007',
		title: 'How do I update my billing information?',
		category: 'ACCOUNT',
		content:
			'Go to Account Settings > Payment Methods to add, edit, or remove billing information. Changes take effect immediately for future purchases.',
		status: 'INACTIVE',
		createdAt: '2026-01-25',
	},
	{
		id: 'faq-008',
		title: 'Are lip products safe for sensitive lips?',
		category: 'MAKEUP',
		content:
			'Many of our lip products are formulated for sensitive skin and are fragrance-free and hypoallergenic. Check the product description for the "sensitive skin safe" badge before purchasing.',
		status: 'ACTIVE',
		createdAt: '2026-01-28',
	},
];

const FAQ_CATEGORIES = ['SKINCARE', 'MAKEUP', 'ORDERS', 'SHIPPING', 'RETURNS', 'ACCOUNT'];

const FaqArticles: NextPage = (props: any) => {
	const [faqs, setFaqs] = useState<MockFaq[]>(initialFaqs);
	const [tabValue, setTabValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState<string>('');
	const [showForm, setShowForm] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const [formTitle, setFormTitle] = useState<string>('');
	const [formCategory, setFormCategory] = useState<string>('SKINCARE');
	const [formContent, setFormContent] = useState<string>('');

	/** HANDLERS **/

	const resetForm = () => {
		setFormTitle('');
		setFormCategory('SKINCARE');
		setFormContent('');
	};

	const handleAddToggle = () => {
		if (showForm) {
			resetForm();
		}
		setShowForm((prev) => !prev);
	};

	const handleSaveFaq = async () => {
		if (!formTitle.trim() || !formContent.trim()) return;

		const newFaq: MockFaq = {
			id: `faq-${Date.now()}`,
			title: formTitle.trim(),
			category: formCategory,
			content: formContent.trim(),
			status: 'ACTIVE',
			createdAt: new Date().toISOString().split('T')[0],
		};

		setFaqs((prev) => [newFaq, ...prev]);
		resetForm();
		setShowForm(false);
		await sweetTopSuccessAlert('FAQ created successfully!');
	};

	const statusChangeHandler = (id: string, status: string) => {
		setFaqs((prev) => prev.map((faq) => (faq.id === id ? { ...faq, status } : faq)));
	};

	const deleteHandler = async (id: string) => {
		const confirmed = await sweetConfirmAlert('Are you sure you want to delete this FAQ?');
		if (confirmed) {
			setFaqs((prev) => prev.filter((faq) => faq.id !== id));
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

	const filteredFaqs = faqs.filter((faq) => {
		const matchesTab =
			tabValue === 'ALL' ||
			(tabValue === 'ACTIVE' && faq.status === 'ACTIVE') ||
			(tabValue === 'INACTIVE' && faq.status === 'INACTIVE');

		const matchesSearch =
			!searchText.trim() ||
			faq.title.toLowerCase().includes(searchText.toLowerCase()) ||
			faq.category.toLowerCase().includes(searchText.toLowerCase());

		return matchesTab && matchesSearch;
	});

	const paginatedFaqs = filteredFaqs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const activeCount = faqs.filter((f) => f.status === 'ACTIVE').length;
	const inactiveCount = faqs.filter((f) => f.status === 'INACTIVE').length;

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'}>
					<Typography variant={'h2'}>FAQ Management</Typography>
					<Typography variant={'subtitle1'} sx={{ color: '#8A8A9A', mt: '4px' }}>
						Manage frequently asked questions
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
						Create New FAQ
					</Typography>
					<Box component={'div'} className={'settings-form-grid'}>
						<TextField
							label={'Title'}
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							size={'small'}
							fullWidth
							placeholder={'Enter FAQ title'}
						/>
						<Select
							value={formCategory}
							onChange={(e: SelectChangeEvent) => setFormCategory(e.target.value)}
							size={'small'}
							fullWidth
						>
							{FAQ_CATEGORIES.map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat}
								</MenuItem>
							))}
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
							rows={3}
							placeholder={'Enter FAQ content'}
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
							onClick={handleSaveFaq}
							sx={{ background: '#2C1654', '&:hover': { background: '#3d1f7a' } }}
						>
							Save FAQ
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
									All ({faqs.length})
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
									placeholder={'Search by title or category'}
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

						<FaqArticlesPanelList
							faqs={paginatedFaqs}
							onStatusChange={statusChangeHandler}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredFaqs.length}
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

export default withAdminLayout(FaqArticles);
