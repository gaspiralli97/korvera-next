import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCategory, SkinType, ProductSize, ProductSubCategory, ProductCertification } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';
import { ProductInput } from '../../types/product/product.input';
import { ProductUpdate } from '../../types/product/product.update';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';

const SUB_CATEGORY_MAP: Record<ProductCategory, ProductSubCategory[]> = {
	[ProductCategory.SKINCARE]: [
		ProductSubCategory.CLEANSERS, ProductSubCategory.TONERS, ProductSubCategory.SERUMS,
		ProductSubCategory.MOISTURISERS, ProductSubCategory.SUNSCREEN, ProductSubCategory.EYE_CARE,
		ProductSubCategory.FACE_MASKS, ProductSubCategory.ACNE_TREATMENTS,
	],
	[ProductCategory.MAKEUP]: [
		ProductSubCategory.FOUNDATION, ProductSubCategory.CONCEALER, ProductSubCategory.PRIMER,
		ProductSubCategory.POWDER, ProductSubCategory.BLUSH_BRONZER, ProductSubCategory.LIP_MAKEUP,
		ProductSubCategory.EYE_MAKEUP, ProductSubCategory.BROWS, ProductSubCategory.SETTING_PRODUCTS,
	],
	[ProductCategory.HAIRCARE]: [
		ProductSubCategory.SHAMPOO, ProductSubCategory.CONDITIONER, ProductSubCategory.HAIR_TREATMENTS,
		ProductSubCategory.SCALP_CARE, ProductSubCategory.HAIR_OILS_SERUMS, ProductSubCategory.STYLING,
	],
	[ProductCategory.BODYCARE]: [
		ProductSubCategory.BODY_WASH, ProductSubCategory.BODY_LOTION, ProductSubCategory.BODY_CREAM_BUTTER,
		ProductSubCategory.BODY_SCRUBS, ProductSubCategory.HAND_CARE, ProductSubCategory.FOOT_CARE,
		ProductSubCategory.DEODORANT, ProductSubCategory.BODY_SUNSCREEN,
	],
	[ProductCategory.FRAGRANCE]: [
		ProductSubCategory.MEN, ProductSubCategory.WOMEN, ProductSubCategory.BODY_MIST,
		ProductSubCategory.HOME_FRAGRANCE, ProductSubCategory.PERFUME,
	],
	[ProductCategory.WELLNESS]: [
		ProductSubCategory.COLLAGEN, ProductSubCategory.VITAMINS, ProductSubCategory.GUT_HEALTH,
		ProductSubCategory.IMMUNITY, ProductSubCategory.SLEEP_STRESS_SUPPORT, ProductSubCategory.TOOLS,
	],
};

const AddProduct = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);
	const [productCategories] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [skinTypes] = useState<SkinType[]>(Object.values(SkinType));
	const [productSizes] = useState<ProductSize[]>(Object.values(ProductSize));
	const [allCertifications] = useState<ProductCertification[]>(Object.values(ProductCertification));
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	const toggleCertification = (cert: ProductCertification) => {
		const current = insertProductData.certifications ?? [];
		const updated = current.includes(cert)
			? current.filter((c) => c !== cert)
			: [...current, cert];
		setInsertProductData({ ...insertProductData, certifications: updated });
	};

	/** APOLLO REQUESTS **/
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const toSafeNumber = (value: string): number => {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	};

	const getProductImageSrc = (image: string): string => {
		if (!image) return '/img/product/bigImage.png';
		if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image;
		return `${REACT_APP_API_URL}/${image}`;
	};

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		skip: !router.query.productId,
		variables: {
			input: router.query.productId as string,
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const p = getProductData?.getProduct;
		if (!p) return;
		setInsertProductData({
			productTitle: p.productTitle ?? '',
			productPrice: Number(p.productPrice) || 0,
			productCategory: p.productCategory ?? '',
			productSubCategory: p.productSubCategory ?? undefined,
			productBrand: p.productBrand ?? '',
			productVolume: Number(p.productVolume) || 0,
			productLeftCount: Number(p.productLeftCount) || 0,
			productSize: p.productSize ?? '',
			productSkinType: p.productSkinType ?? [],
			productDesc: p.productDesc ?? '',
			productImages: p.productImages ?? [],
			certifications: p.certifications ?? [],
		});
	}, [getProductData]);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current?.files;
			const files = selectedFiles ? Array.from(selectedFiles) : [];

			if (files.length === 0) return false;
			if (files.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: files.map(() => null),
						target: 'product',
					},
				}),
			);
			const map: Record<string, string[]> = {};
			files.forEach((_, index) => {
				map[String(index)] = [`variables.files.${index}`];
			});
			formData.append(
				'map',
				JSON.stringify(map),
			);
			files.forEach((file, index) => formData.append(String(index), file));

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response?.data?.data?.imagesUploader;
			if (!Array.isArray(responseImages)) throw new Error('Image upload response is invalid');

			setInsertProductData((prev) => ({ ...prev, productImages: responseImages }));
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}

	const doDisabledCheck = () => {
		if (
			insertProductData.productTitle === '' ||
			!Number.isFinite(insertProductData.productPrice) ||
			insertProductData.productPrice === 0 ||
			!insertProductData.productCategory ||
			insertProductData.productBrand === '' ||
			!Number.isFinite(insertProductData.productVolume) ||
			insertProductData.productVolume === 0 ||
			!insertProductData.productSize ||
			insertProductData.productDesc === '' ||
			insertProductData.productImages.length === 0
		) {
			return true;
		}
	};

	const insertProductHandler = useCallback(async () => {
		try {
			const result = await createProduct({
				variables: {
					input: insertProductData,
				},
			});
			await sweetMixinSuccessAlert('This product has been created successfully.');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {
		try {
			const updateInput: ProductUpdate = {
				...insertProductData,
				_id: getProductData?.getProduct?._id as string,
			};
			const result = await updateProduct({
				variables: {
					input: updateInput,
				},
			});
			await sweetMixinSuccessAlert('This product has been updated successfully.');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProducts',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData, getProductData?.getProduct?._id]);

	if (user?.memberType !== 'SELLER') {
		router.back();
	}


	if (device === 'mobile') {
		return <div>ADD NEW PRODUCT MOBILE PAGE</div>;
	} else {
		return (
			<div id="add-product-page">
				<Stack className="main-title-box">
					<Typography className="main-title">Add New Product</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>

				<div>
					<Stack className="config">
						<Stack className="description-box">
							<Stack className="config-column">
								<Typography className="title">Title</Typography>
								<input
									type="text"
									className="description-input"
									placeholder={'Product Title'}
									value={insertProductData.productTitle}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productTitle: value })
									}
								/>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Brand</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Brand Name'}
										value={insertProductData.productBrand}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productBrand: value })
										}
									/>
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Price</Typography>
									<input
										type="number"
										className="description-input"
										placeholder={'Price'}
										value={insertProductData.productPrice}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productPrice: toSafeNumber(value) })
										}
									/>
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Select Category</Typography>
									<select
										className={'select-description'}
										defaultValue={insertProductData.productCategory || 'select'}
										value={insertProductData.productCategory || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productCategory: value as ProductCategory, productSubCategory: undefined })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{productCategories.map((cat: any) => (
												<option value={`${cat}`} key={cat}>
													{cat}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Select Subcategory</Typography>
									<select
										className={'select-description'}
										value={insertProductData.productSubCategory || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productSubCategory: value as ProductSubCategory })
										}
									>
										<option disabled={true} value={'select'}>Select</option>
										{(SUB_CATEGORY_MAP[insertProductData.productCategory as ProductCategory] ?? []).map((sub) => (
											<option value={sub} key={sub}>{sub.replace(/_/g, ' ')}</option>
										))}
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Select Size</Typography>
									<select
										className={'select-description'}
										defaultValue={insertProductData.productSize || 'select'}
										value={insertProductData.productSize || 'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productSize: value as ProductSize })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{productSizes.map((size: any) => (
												<option value={`${size}`} key={size}>
													{size}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Skin Type</Typography>
									<select
										className={'select-description'}
										value={(insertProductData.productSkinType || [])[0] || 'select'}
										defaultValue={'select'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productSkinType: [value as SkinType] })
										}
									>
										<option disabled={true} selected={true} value={'select'}>
											Select
										</option>
										{skinTypes.map((type: string) => (
											<option value={`${type}`} key={type}>{type}</option>
										))}
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>
							</Stack>

							<Stack className="config-row">
								<Stack className="price-year-after-price">
									<Typography className="title">Volume (ml)</Typography>
									<input
										type="number"
										className="description-input"
										placeholder={'Volume in ml'}
										value={insertProductData.productVolume}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productVolume: toSafeNumber(value) })
										}
									/>
								</Stack>
								<Stack className="price-year-after-price">
									<Typography className="title">Stock Count</Typography>
									<input
										type="number"
										min={0}
										className="description-input"
										placeholder={'Available quantity'}
										value={insertProductData.productLeftCount ?? 0}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productLeftCount: toSafeNumber(value) })
										}
									/>
								</Stack>
							</Stack>
							<Stack className="config-column">
								<Typography className="title">Certifications</Typography>
								<div className={'certifications-grid'}>
									{allCertifications.map((cert) => {
										const selected = (insertProductData.certifications ?? []).includes(cert);
										return (
											<div
												key={cert}
												className={`cert-chip${selected ? ' selected' : ''}`}
												onClick={() => toggleCertification(cert)}
											>
												{cert.replace(/_/g, ' ')}
											</div>
										);
									})}
								</div>
							</Stack>

							<Typography className="product-title">Product Description</Typography>
							<Stack className="config-column">
								<Typography className="title">Description</Typography>
								<textarea
									name=""
									id=""
									className="description-text"
									value={insertProductData.productDesc}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productDesc: value })
									}
								></textarea>
							</Stack>
						</Stack>

						<Typography className="upload-title">Upload photos of your product</Typography>
						<Stack className="images-box">
							<Stack className="upload-box">
								<svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none">
									<g clipPath="url(#clip0_7037_5336)">
										<path
											d="M68.9453 52.0141H52.9703C52.4133 52.0681 51.8511 52.005 51.32 51.8289C50.7888 51.6528 50.3004 51.3675 49.886 50.9914C49.4716 50.6153 49.1405 50.1567 48.9139 49.645C48.6874 49.1333 48.5703 48.5799 48.5703 48.0203C48.5703 47.4607 48.6874 46.9073 48.9139 46.3956C49.1405 45.884 49.4716 45.4253 49.886 45.0492C50.3004 44.6731 50.7888 44.3878 51.32 44.2117C51.8511 44.0356 52.4133 43.9725 52.9703 44.0266H68.9828C69.5397 43.9725 70.1019 44.0356 70.633 44.2117C71.1642 44.3878 71.6527 44.6731 72.067 45.0492C72.4814 45.4253 72.8125 45.884 73.0391 46.3956C73.2657 46.9073 73.3827 47.4607 73.3827 48.0203C73.3827 48.5799 73.2657 49.1333 73.0391 49.645C72.8125 50.1567 72.4814 50.6153 72.067 50.9914C71.6527 51.3675 71.1642 51.6528 70.633 51.8289C70.1019 52.005 69.5397 52.0681 68.9828 52.0141H68.9453Z"
											fill="#DDDDDD"
										/>
										<path
											d="M72.4361 65.0288L63.6236 57.0413C62.8704 56.3994 61.9132 56.0469 60.9236 56.0469C59.934 56.0469 58.9768 56.3994 58.2236 57.0413L49.4111 65.0288C48.6807 65.7585 48.2597 66.7415 48.2355 67.7736C48.2113 68.8057 48.5859 69.8074 49.2813 70.5704C49.9767 71.3335 50.9394 71.7991 51.9693 71.8705C52.9992 71.9419 54.017 71.6136 54.8111 70.9538L56.9111 69.0413V88.0163C57.0074 89.0088 57.4697 89.9298 58.208 90.6C58.9464 91.2701 59.9077 91.6414 60.9048 91.6414C61.9019 91.6414 62.8633 91.2701 63.6016 90.6C64.34 89.9298 64.8023 89.0088 64.8986 88.0163V69.0413L66.9986 70.9538C67.3823 71.3372 67.8398 71.6387 68.3434 71.8403C68.8469 72.0418 69.3861 72.1392 69.9284 72.1265C70.4706 72.1138 71.0046 71.9913 71.4982 71.7664C71.9918 71.5415 72.4346 71.2188 72.8 70.8179C73.1653 70.417 73.4456 69.9463 73.6239 69.434C73.8022 68.9217 73.8748 68.3786 73.8373 67.8375C73.7997 67.2965 73.6529 66.7686 73.4056 66.2858C73.1584 65.8031 72.8158 65.3755 72.3986 65.0288H72.4361Z"
											fill="#DDDDDD"
										/>
									</g>
								</svg>
								<Stack className="text-box">
									<Typography className="drag-title">Drag and drop images here</Typography>
									<Typography className="format-title">Photos must be JPEG or PNG or WEBP format and least 2048x768</Typography>
								</Stack>
								<Button
									className="browse-button"
									onClick={() => {
										inputRef.current.click();
									}}
								>
									<Typography className="browse-button-text">Browse Files</Typography>
									<input
										ref={inputRef}
										type="file"
										hidden={true}
										onChange={uploadImages}
										multiple={true}
										accept="image/jpg, image/jpeg, image/png, image/webp"
									/>
								</Button>
							</Stack>
							<Stack className="gallery-box">
								{insertProductData?.productImages.map((image: string) => {
									const imagePath: string = getProductImageSrc(image);
									return (
										<Stack className="image-box" key={image}>
											<img src={imagePath} alt="" />
										</Stack>
									);
								})}
							</Stack>
						</Stack>

						<Stack className="buttons-row">
							{router.query.productId ? (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={updateProductHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							) : (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={insertProductHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							)}
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

AddProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productCategory: '',
		productBrand: '',
		productVolume: 0,
		productLeftCount: 0,
		productSize: '',
		productSkinType: [],
		productDesc: '',
		productImages: [],
	},
};

export default AddProduct;
