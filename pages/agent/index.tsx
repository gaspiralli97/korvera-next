import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AgentCard from '../../libs/components/common/AgentCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SELLERS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getProductsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getSellers?.list);
			setTotal(data?.getSellers?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else router.replace(`/agent?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, []);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>BRANDS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				{/* ── Page Header ── */}
				<Stack className={'brands-page-header'}>
					<Stack className={'container'}>
						<Box component={'span'} className={'page-eyebrow'}>All Sellers</Box>
						<Box component={'h1'} className={'page-title'}>Discover Brands</Box>
						<Box component={'p'} className={'page-desc'}>
							Explore our curated collection of trusted cosmetics brands and sellers
						</Box>
					</Stack>
				</Stack>

				<Stack className={'container'}>
					{/* ── Filter Bar ── */}
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<Box component={'div'} className={'search-wrap'}>
								<img src="/img/icons/search.svg" alt="" className={'search-icon'} />
								<input
									type="text"
									placeholder={'Search brands or sellers...'}
									value={searchText}
									onChange={(e: any) => setSearchText(e.target.value)}
									onKeyDown={(event: any) => {
										if (event.key === 'Enter') {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: searchText },
											});
										}
									}}
								/>
							</Box>
						</Box>
						<Box component={'div'} className={'right'}>
							<Box component={'span'} className={'sort-label'}>Sort by</Box>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />} className={'sort-btn'}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>Recent</MenuItem>
								<MenuItem onClick={sortingHandler} id={'old'} disableRipple>Oldest</MenuItem>
								<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>Most Liked</MenuItem>
								<MenuItem onClick={sortingHandler} id={'views'} disableRipple>Most Viewed</MenuItem>
							</Menu>
						</Box>
					</Stack>

					{/* ── Results count ── */}
					{agents.length > 0 && (
						<Box component={'p'} className={'results-count'}>
							{total} brand{total !== 1 ? 's' : ''} found
						</Box>
					)}

					{/* ── Brand Grid ── */}
					<Stack className={'card-wrap'}>
						{agents?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No brands found!</p>
							</div>
						) : (
							agents.map((agent: Member) => (
								<AgentCard agent={agent} key={agent._id} likeMemberHandler={likeMemberHandler} />
							))
						)}
					</Stack>

					{/* ── Pagination ── */}
					<Stack className={'pagination'}>
						{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
							<Pagination
								page={currentPage}
								count={Math.ceil(total / searchFilter.limit)}
								onChange={paginationChangeHandler}
								shape="circular"
								color="primary"
							/>
						)}
						{agents.length !== 0 && (
							<Box component={'span'} className={'total-label'}>
								Showing {agents.length} of {total} brands
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
