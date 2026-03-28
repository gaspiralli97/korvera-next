# Bosqichlar: Follow + Like standardization + Unified cards + productLeftCount

## Goal
Implement requested frontend and backend-aligned updates in three stages:
1. Fix follow state query and standardize like icons.
2. Unify homepage product cards through main `ProductCard` and keep zoom styles scoped.
3. Add `productLeftCount` support on frontend and (if available) backend DTO layer.

## Plan

### Stage 1
- [ ] `apollo/user/query.ts`: ensure `GET_MEMBER` requests
      `meFollowed { memberId likeRefId myFollowing }`
- [ ] Standardize like-icon rendering to:
      liked -> `<FavoriteIcon sx={{ color: '#e91e63' }} />`
      not liked -> `<FavoriteBorderIcon />`
      in:
      - `libs/components/product/ProductCard.tsx`
      - `libs/components/homepage/TopProductCard.tsx`
      - `libs/components/homepage/TrendProductCard.tsx`
      - `libs/components/common/ProductBigCard.tsx`
- [ ] `libs/components/homepage/PopularProductCard.tsx`:
      add/ensure like button using the same pattern if missing
- [ ] `libs/components/mypage/RecentlyVisited.tsx`: replace property-domain empty-state text

### Stage 2
- [ ] Replace render output in:
      - `libs/components/homepage/PopularProductCard.tsx`
      - `libs/components/homepage/TopProductCard.tsx`
      - `libs/components/homepage/TrendProductCard.tsx`
      with thin wrappers around:
      `<ProductCard product={...} likeProductHandler={...} />`
- [ ] `scss/pc/general.scss`: keep `.zoom-lens` and `.zoom-panel` scoped under `.product-big-card-box` only
- [ ] `scss/pc/homepage/homepage.scss`: rename clearly real-estate domain naming to cosmetics domain equivalents
      and align any dependent component classNames only where needed to preserve rendering

### Stage 3
- [ ] Frontend type updates for `productLeftCount`:
      - `libs/types/product/product.input.ts`
      - `libs/types/product/product.update.ts`
      - `libs/types/product/product.ts`
- [ ] `apollo/user/mutation.ts`:
      add `productLeftCount` to `CREATE_PRODUCT` and `UPDATE_PRODUCT` selection sets
- [ ] `libs/components/mypage/AddNewProduct.tsx`:
      include `productLeftCount` in edit mapping, defaults, validation, and form field
- [ ] Backend DTO updates (`apps/korvera-api/src/libs/dto/product/*.ts`) if backend repo is accessible in this environment

### Verification + Delivery
- [ ] Run focused checks (TypeScript/lint or available build check)
- [ ] Review diff for scope compliance (no unintended SCSS/backend/page changes beyond request)
- [ ] Commit frontend changes and push branch
- [ ] Commit backend changes and push branch (only if backend repo is available)
- [ ] Update or create PR

## Review
(to be filled after implementation)
