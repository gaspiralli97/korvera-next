import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
			_id
			productCategory
			productSubCategory
			productStatus
			productBrand
			productTitle
			productPrice
			productVolume
			productSize
			productSkinType
			productViews
			productLikes
			productRating
			productRatingCount
			productImages
			productDesc
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
			_id
			productCategory
			productSubCategory
			productStatus
			productBrand
			productTitle
			productPrice
			productVolume
			productSize
			productSkinType
			productViews
			productLikes
			productRating
			productRatingCount
			productImages
			productDesc
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const CREATE_NOTICE_BY_ADMIN = gql`
	mutation CreateNoticeByAdmin($input: NoticeInput!) {
		createNoticeByAdmin(input: $input) {
			_id
			noticeCategory
			noticePriority
			noticeStatus
			noticeTitle
			noticeContent
			noticeViews
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input: NoticeUpdate!) {
		updateNoticeByAdmin(input: $input) {
			_id
			noticeCategory
			noticePriority
			noticeStatus
			noticeTitle
			noticeContent
			noticeViews
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNoticeByAdmin($input: String!) {
		removeNoticeByAdmin(noticeId: $input) {
			_id
			noticeCategory
			noticePriority
			noticeStatus
			noticeTitle
			noticeContent
			noticeViews
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         BANNER         *
 *************************/

export const CREATE_BANNER_BY_ADMIN = gql`
	mutation CreateBannerByAdmin($input: BannerInput!) {
		createBannerByAdmin(input: $input) {
			_id
			bannerTitle
			bannerType
			bannerImage
			bannerLink
			bannerPosition
			bannerStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BANNER_BY_ADMIN = gql`
	mutation UpdateBannerByAdmin($input: BannerUpdate!) {
		updateBannerByAdmin(input: $input) {
			_id
			bannerTitle
			bannerType
			bannerImage
			bannerLink
			bannerPosition
			bannerStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BANNER_BY_ADMIN = gql`
	mutation RemoveBannerByAdmin($input: String!) {
		removeBannerByAdmin(bannerId: $input) {
			_id
			bannerTitle
			bannerType
			bannerImage
			bannerLink
			bannerPosition
			bannerStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *          EVENT         *
 *************************/

export const CREATE_EVENT_BY_ADMIN = gql`
	mutation CreateEventByAdmin($input: EventInput!) {
		createEventByAdmin(input: $input) {
			_id
			eventTitle
			eventCategory
			eventDescription
			eventImage
			eventStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_EVENT_BY_ADMIN = gql`
	mutation UpdateEventByAdmin($input: EventUpdate!) {
		updateEventByAdmin(input: $input) {
			_id
			eventTitle
			eventCategory
			eventDescription
			eventImage
			eventStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_EVENT_BY_ADMIN = gql`
	mutation RemoveEventByAdmin($input: String!) {
		removeEventByAdmin(eventId: $input) {
			_id
			eventTitle
			eventCategory
			eventDescription
			eventImage
			eventStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
