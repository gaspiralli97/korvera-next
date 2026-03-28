import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const SETUP_ADMIN = gql`
	mutation SetupAdmin($input: AdminSetupInput!) {
		setupAdmin(input: $input) {
			_id
			memberNick
			memberType
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberPoints
			memberLikes
			memberViews
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

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			_id
			productCategory
			productStatus
			productBrand
			productTitle
			productPrice
			productVolume
			productLeftCount
			productSize
			productSkinType
			productViews
			productLikes
			productRating
			productRatingCount
			productImages
			productDesc
			ingredients
			certifications
			allergens
			isHypoallergenic
			fragranceFree
			alcoholFree
			paoMonths
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
			_id
			productCategory
			productStatus
			productBrand
			productTitle
			productPrice
			productVolume
			productLeftCount
			productSize
			productSkinType
			productViews
			productLikes
			productRating
			productRatingCount
			productImages
			productDesc
			ingredients
			certifications
			allergens
			isHypoallergenic
			fragranceFree
			alcoholFree
			paoMonths
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
			_id
			productCategory
			productStatus
			productBrand
			productTitle
			productPrice
			productVolume
			productSize
			productSkinType
			productViews
			productLikes
			productRank
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *         RATING         *
 *************************/

export const CREATE_RATING = gql`
	mutation CreateRating($input: RatingInput!) {
		createRating(input: $input) {
			_id
			memberId
			productId
			ratingScore
			skinTypeResult
			reviewText
			helpfulCount
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_RATING = gql`
	mutation UpdateRating($input: RatingUpdate!) {
		updateRating(input: $input) {
			_id
			memberId
			productId
			ratingScore
			skinTypeResult
			reviewText
			helpfulCount
			createdAt
			updatedAt
		}
	}
`;

export const MARK_RATING_HELPFUL = gql`
	mutation MarkRatingHelpful($input: String!) {
		markRatingHelpful(ratingId: $input) {
			_id
			memberId
			productId
			ratingScore
			skinTypeResult
			reviewText
			helpfulCount
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *     PRODUCT Q&A        *
 *************************/

export const CREATE_PRODUCT_QUESTION = gql`
	mutation CreateProductQuestion($input: QuestionInput!) {
		createProductQuestion(input: $input) {
			_id
			productId
			memberId
			questionText
			questionStatus
			answerText
			answeredBy
			createdAt
			updatedAt
		}
	}
`;

export const ANSWER_PRODUCT_QUESTION = gql`
	mutation AnswerProductQuestion($input: AnswerInput!) {
		answerProductQuestion(input: $input) {
			_id
			productId
			memberId
			questionText
			questionStatus
			answerText
			answeredBy
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *        WISHLIST        *
 *************************/

export const CREATE_WISHLIST = gql`
	mutation CreateWishlist($input: WishlistInput!) {
		createWishlist(input: $input) {
			_id
			memberId
			wishlistName
			productCount
			products {
				productId
				addedAt
			}
			createdAt
			updatedAt
		}
	}
`;

export const ADD_TO_WISHLIST = gql`
	mutation AddToWishlist($input: AddToWishlistInput!) {
		addToWishlist(input: $input) {
			_id
			memberId
			wishlistName
			productCount
			products {
				productId
				addedAt
			}
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_FROM_WISHLIST = gql`
	mutation RemoveFromWishlist($input: RemoveFromWishlistInput!) {
		removeFromWishlist(input: $input) {
			_id
			memberId
			wishlistName
			productCount
			products {
				productId
				addedAt
			}
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_WISHLIST = gql`
	mutation DeleteWishlist($input: String!) {
		deleteWishlist(wishlistId: $input) {
			_id
			memberId
			wishlistName
			productCount
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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

/**************************
 *      FILE UPLOAD       *
 *************************/

export const IMAGE_UPLOADER = gql`
	mutation ImageUploader($file: Upload!, $target: String!) {
		imageUploader(file: $file, target: $target)
	}
`;

export const IMAGES_UPLOADER = gql`
	mutation ImagesUploader($files: [Upload!]!, $target: String!) {
		imagesUploader(files: $files, target: $target)
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
