import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_SELLERS = gql`
	query GetSellers($input: SellersInquiry!) {
		getSellers(input: $input) {
			list {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

export const GET_SELLER_STATS = gql`
	query GetSellerStats($input: String!) {
		getSellerStats(sellerId: $input) {
			totalProducts
			activeProducts
			soldOutProducts
			totalProductLikes
			totalProductViews
			totalProductComments
			averageProductRating
			totalRatings
			topProductTitle
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
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
			productComments
			productRank
			productRating
			productRatingCount
			productImages
			productDesc
			ingredients
			keyIngredients {
				name
				benefit
			}
			variants {
				variantName
				variantType
				variantPrice
				variantVolume
				variantColor
				variantImages
				variantSku
				isAvailable
			}
			notRecommendedFor
			allergens
			isHypoallergenic
			fragranceFree
			alcoholFree
			certifications
			paoMonths
			expirationDate
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
			memberData {
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
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PRODUCT_BRANDS = gql`
	query GetProductBrands {
		getProductBrands
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
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
				memberData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const SEARCH_PRODUCTS = gql`
	query SearchProducts($input: ProductSearchInquiry!) {
		searchProducts(input: $input) {
			list {
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
				productRank
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
				memberData {
					_id
					memberNick
					memberImage
					memberType
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SIMILAR_PRODUCTS = gql`
	query GetSimilarProducts($input: String!) {
		getSimilarProducts(productId: $input) {
			list {
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
				productRank
				productRating
				productRatingCount
				productImages
				productDesc
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
					memberType
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_PRODUCT_RECOMMENDATIONS = gql`
	query GetProductRecommendations {
		getProductRecommendations {
			list {
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
				productRank
				productRating
				productRatingCount
				productImages
				productDesc
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
					memberType
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SELLER_PRODUCTS = gql`
	query GetSellerProducts($input: SellerProductsInquiry!) {
		getSellerProducts(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
				productComments
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
				memberData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
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
				productComments
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
				memberData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         RATING         *
 *************************/

export const GET_RATINGS = gql`
	query GetRatings($input: RatingsInquiry!) {
		getRatings(input: $input) {
			list {
				_id
				memberId
				productId
				ratingScore
				skinTypeResult
				reviewText
				helpfulCount
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
					memberType
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_RATING_STATS = gql`
	query GetRatingStats($input: String!) {
		getRatingStats(productId: $input) {
			averageRating
			totalRatings
			fiveStars
			fourStars
			threeStars
			twoStars
			oneStar
		}
	}
`;

/**************************
 *     PRODUCT Q&A        *
 *************************/

export const GET_PRODUCT_QNA = gql`
	query GetProductQnA($input: QuestionsInquiry!) {
		getProductQnA(input: $input) {
			list {
				_id
				productId
				memberId
				questionText
				questionStatus
				answerText
				answeredBy
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
					memberType
				}
				answeredByData {
					_id
					memberNick
					memberImage
					memberType
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        WISHLIST        *
 *************************/

export const GET_MY_WISHLISTS = gql`
	query GetMyWishlists {
		getMyWishlists {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_WISHLIST_DETAIL = gql`
	query GetWishlistDetail($input: String!) {
		getWishlistDetail(wishlistId: $input) {
			_id
			memberId
			wishlistName
			productCount
			products {
				productId
				addedAt
				productData {
					_id
					productCategory
					productStatus
					productBrand
					productTitle
					productPrice
					productVolume
					productSize
					productImages
					productRating
					productRatingCount
					productLikes
					memberId
				}
			}
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          EVENT         *
 *************************/

export const GET_EVENTS = gql`
	query GetEvents($input: EventsInquiry!) {
		getEvents(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         BANNER         *
 *************************/

export const GET_BANNERS = gql`
	query GetBanners($input: BannersInquiry!) {
		getBanners(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const GET_NOTICES = gql`
	query GetNotices($input: NoticesInquiry!) {
		getNotices(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;
