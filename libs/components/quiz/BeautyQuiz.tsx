import React, { useState } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { SkinType, ProductCategory } from '../../enums/product.enum';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import ProductCard from '../product/ProductCard';

// ── Step definitions ──────────────────────────────────────────────────────────

interface Option {
	value: string;
	label: string;
	emoji: string;
	desc?: string;
}

const STEPS = [
	{
		id: 'skinType',
		question: 'What is your skin type?',
		subtitle: 'Choose the one that best describes your skin',
		cols: 'cols-3' as const,
		options: [
			{ value: SkinType.NORMAL, label: 'Normal', emoji: '😊', desc: 'Balanced, not too oily or dry' },
			{ value: SkinType.DRY, label: 'Dry', emoji: '🌵', desc: 'Feels tight, flaky or rough' },
			{ value: SkinType.OILY, label: 'Oily', emoji: '✨', desc: 'Shiny, enlarged pores' },
			{ value: SkinType.COMBINATION, label: 'Combination', emoji: '☯️', desc: 'Oily T-zone, dry cheeks' },
			{ value: SkinType.SENSITIVE, label: 'Sensitive', emoji: '🌸', desc: 'Easily irritated, reactive' },
		] as Option[],
	},
	{
		id: 'concern',
		question: 'What is your main skin concern?',
		subtitle: 'We will prioritize products that target this',
		cols: 'cols-3' as const,
		options: [
			{ value: 'acne', label: 'Acne & Blemishes', emoji: '🔴', desc: 'Breakouts, blackheads, whiteheads' },
			{ value: 'aging', label: 'Anti-Aging', emoji: '⏳', desc: 'Fine lines, wrinkles, firmness' },
			{ value: 'brightening', label: 'Brightening', emoji: '🌟', desc: 'Dark spots, uneven tone' },
			{ value: 'hydration', label: 'Hydration', emoji: '💧', desc: 'Dry, dehydrated, dull skin' },
			{ value: 'pores', label: 'Pores', emoji: '🔬', desc: 'Large pores, texture' },
			{ value: 'redness', label: 'Redness', emoji: '🌿', desc: 'Rosacea, redness, irritation' },
		] as Option[],
	},
	{
		id: 'category',
		question: 'What are you shopping for?',
		subtitle: 'Select your main product category',
		cols: 'cols-3' as const,
		options: [
			{ value: ProductCategory.SKINCARE, label: 'Skincare', emoji: '🧴', desc: 'Toners, serums, moisturizers' },
			{ value: ProductCategory.MAKEUP, label: 'Makeup', emoji: '💄', desc: 'Foundation, lip, eye' },
			{ value: ProductCategory.HAIRCARE, label: 'Haircare', emoji: '💆', desc: 'Shampoo, masks, oils' },
			{ value: ProductCategory.BODYCARE, label: 'Body Care', emoji: '🛁', desc: 'Lotion, scrubs, body wash' },
			{ value: ProductCategory.FRAGRANCE, label: 'Fragrance', emoji: '🌹', desc: 'Perfumes, mists, candles' },
			{ value: ProductCategory.WELLNESS, label: 'Wellness', emoji: '🍃', desc: 'Supplements, health, self-care' },
		] as Option[],
	},
	{
		id: 'budget',
		question: 'What is your budget per product?',
		subtitle: 'We will show you products within your range',
		cols: 'cols-2' as const,
		options: [] as Option[],
		budgetOptions: [
			{ value: '0-25', label: 'Under $25' },
			{ value: '25-60', label: '$25 – $60' },
			{ value: '60-120', label: '$60 – $120' },
			{ value: '120-9999', label: '$120+' },
		],
	},
];

// ── Quiz answers state ────────────────────────────────────────────────────────

interface QuizAnswers {
	skinType: string;
	concern: string;
	category: string;
	budget: string;
}

const INITIAL_ANSWERS: QuizAnswers = {
	skinType: '',
	concern: '',
	category: '',
	budget: '',
};

// ── Component ─────────────────────────────────────────────────────────────────

const BeautyQuiz = () => {
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
	const [showResults, setShowResults] = useState(false);
	const [resultProducts, setResultProducts] = useState<Product[]>([]);
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const totalSteps = STEPS.length;
	const current = STEPS[step];
	const progressPct = ((step) / totalSteps) * 100;

	// ── Build query from answers ──
	const buildInquiry = (): ProductsInquiry => {
		const [minPrice, maxPrice] = (answers.budget || '0-9999').split('-').map(Number);
		return {
			page: 1,
			limit: 8,
			sort: 'productRank',
			search: {
				skinTypeList: answers.skinType ? [answers.skinType as SkinType] : undefined,
				categoryList: answers.category ? [answers.category as ProductCategory] : undefined,
				pricesRange: answers.budget ? { start: minPrice, end: maxPrice } : undefined,
			},
		};
	};

	// ── Fetch results when showResults becomes true ──
	const { loading: resultsLoading, refetch: refetchResults } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: buildInquiry() },
		skip: !showResults,
		onCompleted: (data: T) => {
			setResultProducts(data?.getProducts?.list ?? []);
		},
	});

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			const result = await refetchResults({ input: buildInquiry() });
			setResultProducts(result.data?.getProducts?.list ?? []);
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// ── Handlers ──
	const selectOption = (stepId: string, value: string) => {
		setAnswers((prev) => ({ ...prev, [stepId]: value }));
	};

	const currentAnswer = answers[current?.id as keyof QuizAnswers] ?? '';

	const handleNext = () => {
		if (step < totalSteps - 1) {
			setStep((s) => s + 1);
		} else {
			setShowResults(true);
		}
	};

	const handleBack = () => {
		if (step > 0) setStep((s) => s - 1);
	};

	const handleRetake = () => {
		setAnswers(INITIAL_ANSWERS);
		setStep(0);
		setShowResults(false);
		setResultProducts([]);
	};

	const handleShopAll = () => {
		const params = new URLSearchParams();
		if (answers.category) params.set('category', answers.category);
		if (answers.skinType) params.set('skinType', answers.skinType);
		router.push(`/product?${params.toString()}`);
	};

	// ── Profile chips for results ──
	const profileChips = [
		answers.skinType && { icon: '🧬', label: `${answers.skinType} Skin` },
		answers.concern && { icon: '🎯', label: STEPS[1].options.find((o) => o.value === answers.concern)?.label },
		answers.category && { icon: '🛍️', label: answers.category },
		answers.budget && { icon: '💰', label: STEPS[3].budgetOptions?.find((o) => o.value === answers.budget)?.label },
	].filter(Boolean) as { icon: string; label: string }[];

	// ── Results view ──
	if (showResults) {
		return (
			<div id="quiz-page">
				<Stack className="container">
					<Stack className="quiz-results">
						<Stack className="results-header">
							<div className="results-emoji">✨</div>
							<Typography className="results-title">Your Personalized Picks</Typography>
							<Typography className="results-subtitle">
								Based on your answers, we found these products for you
							</Typography>
						</Stack>

						<Stack className="profile-chips">
							{profileChips.map((chip, i) => (
								<span key={i} className="profile-chip">
									<span className="chip-icon">{chip.icon}</span>
									{chip.label}
								</span>
							))}
						</Stack>

						<Typography className="results-section-title">Recommended for You</Typography>

						{resultsLoading ? (
							<div className="results-empty">
								<p>Finding your perfect matches...</p>
							</div>
						) : resultProducts.length === 0 ? (
							<div className="results-empty">
								<p>No exact matches found — try browsing all products.</p>
							</div>
						) : (
							<div className="results-products-grid">
								{resultProducts.map((product: Product) => (
									<ProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
								))}
							</div>
						)}

						<Stack className="results-actions">
							<Button className="retake-btn" onClick={handleRetake}>
								Retake Quiz
							</Button>
							<Button className="shop-btn" onClick={handleShopAll}>
								Shop All {answers.category || 'Products'}
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</div>
		);
	}

	// ── Quiz step view ──
	return (
		<div id="quiz-page">
			<Stack className="container">
				{/* Progress */}
				<Stack className="quiz-progress">
					<Typography className="step-label">
						Step {step + 1} of {totalSteps}
					</Typography>
					<div className="progress-track">
						<div className="progress-fill" style={{ width: `${progressPct}%` }} />
					</div>
					<div className="step-dots">
						{STEPS.map((_, i) => (
							<div
								key={i}
								className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
							/>
						))}
					</div>
				</Stack>

				{/* Card */}
				<Stack className="quiz-card" key={step}>
					<Typography className="quiz-question">{current.question}</Typography>
					<Typography className="quiz-subtitle">{current.subtitle}</Typography>

					{/* Budget chips */}
					{current.budgetOptions ? (
						<div className="budget-options">
							{current.budgetOptions.map((opt) => (
								<div
									key={opt.value}
									className={`budget-chip ${currentAnswer === opt.value ? 'selected' : ''}`}
									onClick={() => selectOption(current.id, opt.value)}
								>
									<Typography className="chip-label">{opt.label}</Typography>
								</div>
							))}
						</div>
					) : (
						<div className={`options-grid ${current.cols}`}>
							{current.options.map((opt: Option) => (
								<div
									key={opt.value}
									className={`option-card ${currentAnswer === opt.value ? 'selected' : ''}`}
									onClick={() => selectOption(current.id, opt.value)}
								>
									<span className="option-emoji">{opt.emoji}</span>
									<Typography className="option-label">{opt.label}</Typography>
									{opt.desc && <Typography className="option-desc">{opt.desc}</Typography>}
								</div>
							))}
						</div>
					)}

					{/* Navigation */}
					<Stack className="quiz-nav">
						{step > 0 ? (
							<button className="back-btn" onClick={handleBack}>
								<ArrowBackIcon />
								Back
							</button>
						) : (
							<span />
						)}
						<button
							className="next-btn"
							onClick={handleNext}
							disabled={!currentAnswer}
						>
							{step < totalSteps - 1 ? 'Next' : 'See My Results'}
							<ArrowForwardIcon />
						</button>
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};

export default BeautyQuiz;
