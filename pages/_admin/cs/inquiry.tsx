import React, { useState, useCallback } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Divider, InputAdornment, List, ListItem, OutlinedInput, Stack, TablePagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TabContext } from '@mui/lab';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { InquiryList, MockInquiry } from '../../../libs/components/admin/cs/InquiryList';
import { sweetConfirmAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';

const MOCK_INQUIRIES: MockInquiry[] = [
	{
		id: 'INQ-001',
		userNick: 'bella_skin',
		userEmail: 'bella@example.com',
		title: 'My order has not arrived after 10 days',
		content:
			'I placed order #ORD-7821 on March 15th and it still has not been delivered. Tracking shows it has been stuck at the distribution center for 5 days. Please help.',
		reply: 'Hello Bella, we have escalated your shipment to the courier. You will receive an update within 24 hours. We apologize for the inconvenience.',
		status: 'ANSWERED',
		createdAt: '2026-03-20',
	},
	{
		id: 'INQ-002',
		userNick: 'rosa_cosmetics',
		userEmail: 'rosa@example.com',
		title: 'How do I return a damaged product?',
		content:
			'I received the Rose Glow Serum and the bottle cap was cracked, causing a leak. I would like to return or exchange this item. What is the process?',
		reply: '',
		status: 'PENDING',
		createdAt: '2026-03-21',
	},
	{
		id: 'INQ-003',
		userNick: 'seller_luxe',
		userEmail: 'luxe@example.com',
		title: 'Seller payout not received for February',
		content:
			'My February payout of $1,240 was scheduled for March 5th but has not appeared in my bank account. My seller ID is SLR-0042. Please check.',
		reply: 'Hi, we have investigated and found a processing delay. Your payment has been reissued and should arrive within 2-3 business days.',
		status: 'ANSWERED',
		createdAt: '2026-03-18',
	},
	{
		id: 'INQ-004',
		userNick: 'glow_queen',
		userEmail: 'glowqueen@example.com',
		title: 'Is the Vitamin C Brightening Cream vegan?',
		content:
			'I am strictly vegan and want to confirm whether the Vitamin C Brightening Cream contains any animal-derived ingredients before purchasing.',
		reply: '',
		status: 'PENDING',
		createdAt: '2026-03-22',
	},
	{
		id: 'INQ-005',
		userNick: 'mia_beauty',
		userEmail: 'mia@example.com',
		title: 'Cannot log into my account after password reset',
		content:
			'I reset my password using the email link but the new password is still not accepted. I have tried three times and keep getting an invalid credentials error.',
		reply: 'Hello Mia, your account had a session conflict. We have cleared the cache on our end. Please try resetting your password once more — it should work now.',
		status: 'ANSWERED',
		createdAt: '2026-03-19',
	},
	{
		id: 'INQ-006',
		userNick: 'seller_naturals',
		userEmail: 'naturals@example.com',
		title: 'How to update product listing images?',
		content:
			'I am a registered seller and I cannot find the option to update my product images in the seller dashboard. The edit button seems to be missing for some products.',
		reply: '',
		status: 'PENDING',
		createdAt: '2026-03-23',
	},
	{
		id: 'INQ-007',
		userNick: 'crystal_glow',
		userEmail: 'crystal@example.com',
		title: 'Refund request for cancelled order',
		content:
			'I cancelled order #ORD-8102 within 30 minutes of placing it as instructed, but my refund has not been processed after 7 days. My payment was via credit card.',
		reply: 'Hi Crystal, your refund of $68.50 has been processed today. Please allow 3-5 business days for it to appear on your statement.',
		status: 'CLOSED',
		createdAt: '2026-03-15',
	},
	{
		id: 'INQ-008',
		userNick: 'jade_skin',
		userEmail: 'jade@example.com',
		title: 'Wrong item sent in my order',
		content:
			'I ordered the Hyaluronic Acid Moisturizer (50ml) but received the Retinol Night Cream instead. My order number is #ORD-8899. Please send the correct item.',
		reply: '',
		status: 'PENDING',
		createdAt: '2026-03-24',
	},
	{
		id: 'INQ-009',
		userNick: 'seller_bloom',
		userEmail: 'bloom@example.com',
		title: 'Seller account verification pending for 2 weeks',
		content:
			'I submitted all required documents for seller verification on March 8th but my account is still showing as unverified. Could you please expedite the review?',
		reply: 'Hello, your documents have been reviewed and your seller account is now fully verified. You can start listing products immediately.',
		status: 'ANSWERED',
		createdAt: '2026-03-10',
	},
	{
		id: 'INQ-010',
		userNick: 'luna_beauty',
		userEmail: 'luna@example.com',
		title: 'Promo code not applying at checkout',
		content:
			'I have a promo code SPRING20 that was sent in my newsletter email but it says invalid when I try to apply it at checkout. The code expires March 31st.',
		reply: 'Hi Luna, the SPRING20 code had a technical issue that has now been fixed. It should apply correctly now. We have also added a 5% bonus to your account as an apology.',
		status: 'CLOSED',
		createdAt: '2026-03-17',
	},
];

const STATUS_TABS = ['ALL', 'PENDING', 'ANSWERED', 'CLOSED'];

const InquiryArticles: NextPage = (props: any) => {
	const [inquiries, setInquiries] = useState<MockInquiry[]>(MOCK_INQUIRIES);
	const [tabValue, setTabValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const getTabCount = (tab: string): number => {
		if (tab === 'ALL') return inquiries.length;
		return inquiries.filter((inq) => inq.status === tab).length;
	};

	const textHandler = useCallback((value: string) => {
		setSearchText(value);
		setPage(0);
	}, []);

	const replyHandler = (id: string, reply: string) => {
		setInquiries((prev) =>
			prev.map((inq) => (inq.id === id ? { ...inq, reply, status: 'ANSWERED' } : inq)),
		);
		sweetTopSuccessAlert('Reply saved successfully!');
	};

	const statusChangeHandler = (id: string, status: string) => {
		setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
	};

	const deleteHandler = async (id: string) => {
		const confirmed = await sweetConfirmAlert('Are you sure you want to delete this inquiry?');
		if (confirmed) {
			setInquiries((prev) => prev.filter((inq) => inq.id !== id));
		}
	};

	const filteredInquiries = inquiries.filter((inq) => {
		const matchesTab = tabValue === 'ALL' || inq.status === tabValue;
		const matchesSearch =
			!searchText ||
			inq.userNick.toLowerCase().includes(searchText.toLowerCase()) ||
			inq.title.toLowerCase().includes(searchText.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const paginatedInquiries = filteredInquiries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} sx={{ mb: '24px' }}>
				<Typography variant={'h2'} className={'tit'}>
					1:1 Inquiry Management
				</Typography>
				<Typography variant={'subtitle1'} sx={{ color: '#888', fontSize: '13px', mt: '4px' }}>
					Handle customer and seller support tickets
				</Typography>
			</Box>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={tabValue}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								{STATUS_TABS.map((tab) => (
									<ListItem
										key={tab}
										onClick={() => {
											setTabValue(tab);
											setPage(0);
										}}
										value={tab}
										className={tabValue === tab ? 'li on' : 'li'}
									>
										{tab === 'ALL' ? `All (${getTabCount('ALL')})` : `${tab} (${getTabCount(tab)})`}
									</ListItem>
								))}
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={'Search by user nickname or title'}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => textHandler('')} />
											)}
											<InputAdornment position={'end'}>
												<img src={'/img/icons/search_icon.png'} alt={'search'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						<InquiryList
							inquiries={paginatedInquiries}
							onReply={replyHandler}
							onStatusChange={statusChangeHandler}
							onDelete={deleteHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component={'div'}
							count={filteredInquiries.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => {
								setRowsPerPage(parseInt(e.target.value, 10));
								setPage(0);
							}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(InquiryArticles);
