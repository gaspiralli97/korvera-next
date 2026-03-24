# Refactoring: Property-based → Cosmetic/Product-based

## Goal
Rename all `property`-based naming to `product`/`cosmetic`-based naming across:
- `pages/product/detail.tsx`
- `pages/product/index.tsx`
- `libs/components/product/ProductCard.tsx`
- `libs/components/product/Filter.tsx`
- `libs/components/common/ProductBigCard.tsx`
- `scss/pc/product/detail.scss`
- `scss/pc/product/product.scss`
- `scss/pc/general.scss`

## Detailed Spec

### Naming changes

| Old (property) | New (product/cosmetic) |
|---|---|
| `PropertyDetail` component | `ProductDetail` |
| `property` state variable | `product` |
| `properties` state variable | `products` |
| `destinationProperties` | `similarProducts` |
| `likePropertyHandler` | `likeProductHandler` |
| `goPropertyDetatilPage` | `goProductDetailPage` |
| `property-detail-page` id | `product-detail-page` |
| `property-detail-config` class | `product-detail-config` |
| `property-desc-config` class | `product-desc-config` |
| `property-big-card-box` class | `product-big-card-box` |
| `property-list-page` id | `product-list-page` |
| `property-page` class | `product-page` |
| `similar-properties-config` class | `similar-products-config` |
| Interface `ProductCardType` prop `property` | `product` |
| Interface `ProductBigCardProps` prop `property` | `product` |
| Interface `FilterType` | `FilterProps` |
| Mobile fallback "PROPERTY CARD" | "PRODUCT CARD" |
| Mobile fallback "PROPERTY DETAIL PAGE" | "PRODUCT DETAIL PAGE" |
| Mobile fallback "PROPERTIES MOBILE" | "PRODUCTS MOBILE" |
| Mobile fallback "APARTMEND BIG CARD" | "PRODUCT BIG CARD" |
| `ProductBigCard` real-estate icons (`bed.svg`, `room.svg`, `expand.svg`) | cosmetic-appropriate info (category, size, volume) |

### SCSS class/id renames
- `#property-detail-page` → `#product-detail-page`
- `.property-detail-config` → `.product-detail-config`
- `.property-desc-config` → `.product-desc-config`
- `#property-list-page` → `#product-list-page`
- `.property-page` → `.product-page`
- `.similar-properties-config` → `.similar-products-config`
- `.property-big-card-box` → `.product-big-card-box`

## Checklist
- [ ] pages/product/detail.tsx
- [ ] pages/product/index.tsx
- [ ] libs/components/product/ProductCard.tsx
- [ ] libs/components/product/Filter.tsx
- [ ] libs/components/common/ProductBigCard.tsx
- [ ] scss/pc/product/detail.scss
- [ ] scss/pc/product/product.scss
- [ ] scss/pc/general.scss
- [ ] Verify no broken references remain
- [ ] git commit & push

## Review
(to be filled after implementation)
