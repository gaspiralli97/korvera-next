import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'SKINCARE_TIPS' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<div className={'mob-community-page'}>
				<div className={'mob-community-header'}>
					<h1 className={'mob-community-title'}>Community</h1>
					<Button className={'mob-community-write-btn'} onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}>+ Write</Button>
				</div>
				<div className={'mob-community-tabs'}>
					{(['SKINCARE_TIPS', 'PRODUCT_REVIEWS', 'BEAUTY_NEWS', 'HUMOR'] as const).map((cat) => (
						<button
							key={cat}
							className={`mob-community-tab${searchCommunity.search.articleCategory === cat ? ' active' : ''}`}
							onClick={(e) => tabChangeHandler(e, cat)}
						>
							{cat === 'SKINCARE_TIPS' ? 'Tips' : cat === 'PRODUCT_REVIEWS' ? 'Reviews' : cat === 'BEAUTY_NEWS' ? 'News' : 'Humor'}
						</button>
					))}
				</div>
				<div className={'mob-community-list'}>
					{totalCount ? (
						boardArticles?.map((boardArticle: BoardArticle) => (
							<CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />
						))
					) : (
						<div className={'mob-community-no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No articles yet. Be the first to write!</p>
						</div>
					)}
				</div>
				{totalCount > 0 && (
					<div className={'mob-community-pagination'}>
						<Pagination
							count={Math.ceil(totalCount / searchCommunity.limit)}
							page={searchCommunity.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div id="community-list-page">
				<div className="comm-container">

					{/* ── Page Header ── */}
					<div className="comm-header">
						<div className="comm-header-left">
							<span className="comm-eyebrow">Korvera Community</span>
							<h1 className="comm-title">Share. Discover. Connect.</h1>
							<p className="comm-sub">Tips, reviews, and beauty stories from our global community</p>
						</div>
						<Button
							className="comm-write-btn"
							onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
						>
							+ Write Article
						</Button>
					</div>

					{/* ── Tabs + Cards ── */}
					<TabContext value={searchCommunity.search.articleCategory}>
						<div className="comm-tabs-wrap">
							<TabList
								onChange={tabChangeHandler}
								TabIndicatorProps={{ style: { display: 'none' } }}
								className="comm-tab-list"
							>
								<Tab value={'SKINCARE_TIPS'} label={'Skincare Tips'} className={`comm-tab ${searchCommunity.search.articleCategory === 'SKINCARE_TIPS' ? 'comm-tab--active' : ''}`} />
								<Tab value={'PRODUCT_REVIEWS'} label={'Product Reviews'} className={`comm-tab ${searchCommunity.search.articleCategory === 'PRODUCT_REVIEWS' ? 'comm-tab--active' : ''}`} />
								<Tab value={'BEAUTY_NEWS'} label={'Beauty News'} className={`comm-tab ${searchCommunity.search.articleCategory === 'BEAUTY_NEWS' ? 'comm-tab--active' : ''}`} />
								<Tab value={'HUMOR'} label={'Humor'} className={`comm-tab ${searchCommunity.search.articleCategory === 'HUMOR' ? 'comm-tab--active' : ''}`} />
							</TabList>
						</div>

						{(['SKINCARE_TIPS', 'PRODUCT_REVIEWS', 'BEAUTY_NEWS', 'HUMOR'] as const).map((cat) => (
							<TabPanel key={cat} value={cat} className="comm-panel">
								{totalCount ? (
									<div className="comm-grid">
										{boardArticles?.map((boardArticle: BoardArticle) => (
											<CommunityCard
												boardArticle={boardArticle}
												key={boardArticle?._id}
												likeArticleHandler={likeArticleHandler}
											/>
										))}
									</div>
								) : (
									<div className="comm-no-data">
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No articles found yet. Be the first to write!</p>
									</div>
								)}
							</TabPanel>
						))}
					</TabContext>

					{/* ── Pagination ── */}
					{totalCount > 0 && (
						<div className="comm-pagination">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="comm-total">
								{totalCount} article{totalCount > 1 ? 's' : ''}
							</Typography>
						</div>
					)}

				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'SKINCARE_TIPS',
		},
	},
};

export default withLayoutBasic(Community);
