import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';

interface ArticleProps {
	boardArticle: BoardArticle;
}

const Article = ({ boardArticle }: ArticleProps) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'mob-article-card'}>
				<Box className={'mob-article-date'}>
					<Typography className={'mob-article-day'}>
						{boardArticle?.createdAt ? new Date(boardArticle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
					</Typography>
				</Box>
				<Stack className={'mob-article-info'}>
					<Typography className={'mob-article-title'}>{boardArticle?.articleTitle ?? ''}</Typography>
					<Typography className={'mob-article-category'}>{boardArticle?.articleCategory ?? ''}</Typography>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Box component={'div'} className={'date'}>
						<Typography>
							{boardArticle?.createdAt
								? new Date(boardArticle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
								: ''}
						</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Typography>{boardArticle?.articleTitle ?? ''}</Typography>
						</Stack>
						<Stack className="address">
							<Typography>{boardArticle?.articleCategory ?? ''}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Article;
