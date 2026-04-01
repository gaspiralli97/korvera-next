# Bosqichlar: Follow + Like standardization + Unified cards + productLeftCount

## Goal
Implement requested frontend and backend-aligned updates in three stages:
1. Fix follow state query and standardize like icons.
2. Unify homepage product cards through main `ProductCard` and keep zoom styles scoped.
3. Add `productLeftCount` support on frontend and (if available) backend DTO layer.

## Plan

### Stage 1
- [x] `apollo/user/query.ts`: ensure `GET_MEMBER` requests
      `meFollowed { followingId followerId myFollowing }` — already correct
- [x] Standardize like-icon rendering to:
      liked -> `<FavoriteIcon sx={{ color: '#e91e63' }} />`
      not liked -> `<FavoriteBorderIcon />`
      in:
      - `libs/components/product/ProductCard.tsx` — removed stale `sx={{ color: '#9e9e9e' }}`
      - `libs/components/common/ProductBigCard.tsx` — already correct
- [x] `libs/components/homepage/PopularProductCard.tsx`, `TopProductCard.tsx`, `TrendProductCard.tsx`:
      already replaced — `ProductTabs` uses `ProductCard` directly
- [x] `libs/components/mypage/RecentlyVisited.tsx`: replaced mobile placeholder text

### Stage 2
- [x] Homepage card wrappers already unified via `ProductTabs` → `ProductCard`
- [x] `scss/pc/general.scss`: `.zoom-lens` and `.zoom-panel` already scoped under `.product-big-card-box`
- [x] `scss/pc/homepage/homepage.scss`: no real-estate domain naming found

### Stage 3
- [x] Frontend type updates for `productLeftCount` — already present in all three type files
- [x] `apollo/user/mutation.ts`: `productLeftCount` already in `CREATE_PRODUCT` and `UPDATE_PRODUCT`
- [x] `libs/components/mypage/AddNewProduct.tsx`: `productLeftCount` already in form, defaults, mapping
- [x] Backend DTO updates — `productLeftCount` already in all three backend DTO files

### Verification + Delivery
- [x] All changes verified via code review
- [ ] Run TypeScript build check
- [ ] Commit and push

## Review
All three stages are complete. The only actual code changes required were:
1. Removed `sx={{ color: '#9e9e9e' }}` from `FavoriteBorderIcon` in `ProductCard.tsx`
2. Fixed mobile placeholder in `RecentlyVisited.tsx` from "KORVERA MY FAVORITES MOBILE" → "RECENTLY VISITED"
Everything else was already implemented from prior work.
