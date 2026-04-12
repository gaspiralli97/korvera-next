import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { GET_SELLERS } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const About: NextPage = () => {
	const device = useDeviceDetect();
	const [sellers, setSellers] = useState<any[]>([]);

	useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 10, sort: 'memberRank', direction: 'DESC', search: {} } },
		onCompleted: (data: T) => {
			setSellers(data?.getSellers?.list ?? []);
		},
	});

	if (device === 'mobile') {
		return (
			<div className={'mob-about-page'}>
				<div className={'mob-about-hero'}>
					<span className={'mob-about-eyebrow'}>Our Story</span>
					<h1 className={'mob-about-title'}>Beauty Is Our Passion</h1>
					<p className={'mob-about-sub'}>We believe beauty should be accessible, joyful, and empowering for everyone.</p>
					<div className={'mob-about-cta'}>
						<Link href="/product"><button className={'mob-about-btn-primary'}>Shop Now</button></Link>
						<Link href="/seller"><button className={'mob-about-btn-ghost'}>Explore Brands</button></Link>
					</div>
				</div>
				<div className={'mob-about-stats'}>
					{[
						{ num: '500+', label: 'Premium Brands' },
						{ num: '12K+', label: 'Products' },
						{ num: '2M+', label: 'Customers' },
						{ num: '98%', label: 'Satisfaction' },
					].map(({ num, label }) => (
						<div key={label} className={'mob-about-stat-card'}>
							<span className={'mob-about-stat-num'}>{num}</span>
							<span className={'mob-about-stat-label'}>{label}</span>
						</div>
					))}
				</div>
				<div className={'mob-about-section'}>
					<span className={'mob-about-label'}>Who We Are</span>
					<h2 className={'mob-about-section-title'}>Redefining Beauty</h2>
					<p className={'mob-about-body'}>Korvera was born from a simple belief — that great skincare and beauty products should not be a luxury reserved for the few.</p>
					<div className={'mob-about-pills'}>
						{['🐰 Cruelty-Free', '🌿 Clean Beauty', '🌍 Sustainable', '✨ Expert-Curated'].map((p) => (
							<span key={p} className={'mob-about-pill'}>{p}</span>
						))}
					</div>
				</div>
				<div className={'mob-about-values'}>
					<span className={'mob-about-label'}>What We Stand For</span>
					<h2 className={'mob-about-section-title'}>Our Core Values</h2>
					{[
						{ icon: '🧬', title: 'Science-Backed', desc: 'Clinically proven ingredients backed by dermatological research.' },
						{ icon: '🌿', title: 'Clean Beauty', desc: 'We ban over 2,500 questionable ingredients.' },
						{ icon: '🌈', title: 'Beauty for All', desc: 'We celebrate every skin tone, type, age, and gender identity.' },
						{ icon: '♻️', title: 'Planet Positive', desc: 'Committed to a greener, more sustainable future.' },
					].map(({ icon, title, desc }) => (
						<div key={title} className={'mob-about-value-card'}>
							<span className={'mob-about-value-icon'}>{icon}</span>
							<div>
								<h3 className={'mob-about-value-title'}>{title}</h3>
								<p className={'mob-about-value-desc'}>{desc}</p>
							</div>
						</div>
					))}
				</div>
				{sellers.length > 0 && (
					<div className={'mob-about-partners'}>
						<span className={'mob-about-label'}>Trusted Partners</span>
						<h2 className={'mob-about-section-title'}>Brands We Carry</h2>
						<div className={'mob-about-partners-scroll'}>
							{sellers.map((seller: any) => (
								<Link key={seller._id} href={`/seller/detail?agentId=${seller._id}`}>
									<div className={'mob-about-partner-chip'}>
										{seller.memberImage && (
											<img src={`${REACT_APP_API_URL}/${seller.memberImage}`} alt={seller.memberNick} className={'mob-about-partner-logo'} />
										)}
										<span>{seller.memberFullName ?? seller.memberNick}</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
				<div className={'mob-about-bottom-cta'}>
					<h2>Start Your Beauty Journey</h2>
					<Link href="/product"><button className={'mob-about-btn-primary'}>Shop the Collection</button></Link>
				</div>
			</div>
		);
	}

	return (
		<div id={'about-page'}>

			{/* ═══════════════════════════════════════════
			    1. HERO — full-width dark banner
			═══════════════════════════════════════════ */}
			<section className={'ab-hero'}>
				<div className={'ab-hero-inner'}>
					<span className={'ab-eyebrow'}>Our Story</span>
					<h1 className={'ab-hero-title'}>Beauty Is<br />Our Passion</h1>
					<p className={'ab-hero-sub'}>
						We believe beauty should be accessible, joyful, and empowering for everyone.
						From skincare essentials to makeup artistry — we curate the world's finest cosmetics.
					</p>
					<div className={'ab-hero-cta'}>
						<Link href="/product">
							<button className={'ab-btn-primary'}>Shop Now</button>
						</Link>
						<Link href="/seller">
							<button className={'ab-btn-ghost'}>Explore Brands</button>
						</Link>
					</div>
				</div>
				<div className={'ab-hero-overlay'} />
			</section>

			{/* ═══════════════════════════════════════════
			    2. MISSION — split layout
			═══════════════════════════════════════════ */}
			<section className={'ab-mission'}>
				<div className={'ab-container'}>
					<div className={'ab-mission-img'}>
						<img src="/img/korvera/spring.jpg" alt="Our Mission" />
						<div className={'ab-mission-badge'}>
							<span className={'ab-badge-num'}>2018</span>
							<span className={'ab-badge-text'}>Founded</span>
						</div>
					</div>
					<div className={'ab-mission-text'}>
						<span className={'ab-label'}>Who We Are</span>
						<h2 className={'ab-section-title'}>
							Redefining Beauty, One Product at a Time
						</h2>
						<p className={'ab-body-text'}>
							Korvera was born from a simple belief — that great skincare and beauty products should not be a luxury
							reserved for the few. We partner with the world's most innovative cosmetics brands to bring you a
							curated selection of clean, effective, and luxurious products.
						</p>
						<p className={'ab-body-text'}>
							Our team of beauty experts, dermatologists, and brand specialists hand-pick every item on our platform,
							ensuring that what you put on your skin meets the highest standards of quality, safety, and efficacy.
						</p>
						<div className={'ab-mission-pills'}>
							<span className={'ab-pill'}>🐰 Cruelty-Free</span>
							<span className={'ab-pill'}>🌿 Clean Beauty</span>
							<span className={'ab-pill'}>🌍 Sustainable</span>
							<span className={'ab-pill'}>✨ Expert-Curated</span>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    3. STATS — 4 numbers
			═══════════════════════════════════════════ */}
			<section className={'ab-stats'}>
				<div className={'ab-container'}>
					{[
						{ num: '500+', label: 'Premium Brands', sub: 'Carefully vetted partners' },
						{ num: '12K+', label: 'Products', sub: 'Across every category' },
						{ num: '2M+', label: 'Happy Customers', sub: 'And growing every day' },
						{ num: '98%', label: 'Satisfaction Rate', sub: 'Based on verified reviews' },
					].map(({ num, label, sub }) => (
						<div key={label} className={'ab-stat-card'}>
							<span className={'ab-stat-num'}>{num}</span>
							<span className={'ab-stat-label'}>{label}</span>
							<span className={'ab-stat-sub'}>{sub}</span>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    4. VALUES — 4 pillars
			═══════════════════════════════════════════ */}
			<section className={'ab-values'}>
				<div className={'ab-container ab-container--col'}>
					<div className={'ab-section-header'}>
						<span className={'ab-label'}>What We Stand For</span>
						<h2 className={'ab-section-title'}>Our Core Values</h2>
					</div>
					<div className={'ab-values-grid'}>
						{[
							{
								icon: '🧬',
								title: 'Science-Backed Formulas',
								desc: 'Every product is evaluated for clinically proven ingredients backed by dermatological research.',
							},
							{
								icon: '🌿',
								title: 'Clean Beauty First',
								desc: 'We ban over 2,500 questionable ingredients. Our Clean Beauty standard sets the bar for the industry.',
							},
							{
								icon: '🌈',
								title: 'Beauty for All',
								desc: 'Inclusivity is in our DNA. We celebrate every skin tone, type, age, and gender identity.',
							},
							{
								icon: '♻️',
								title: 'Planet Positive',
								desc: 'From sustainable packaging to carbon-neutral shipping — we are committed to a greener future.',
							},
						].map(({ icon, title, desc }) => (
							<div key={title} className={'ab-value-card'}>
								<div className={'ab-value-icon'}>{icon}</div>
								<h3 className={'ab-value-title'}>{title}</h3>
								<p className={'ab-value-desc'}>{desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    5. CLEAN BEAUTY — dark full-width
			═══════════════════════════════════════════ */}
			<section className={'ab-clean'}>
				<div className={'ab-container ab-container--row-center'}>
					<div className={'ab-clean-left'}>
						<span className={'ab-label ab-label--light'}>Clean at Korvera</span>
						<h2 className={'ab-section-title ab-section-title--light'}>
							We Hold Every Product to a Higher Standard
						</h2>
						<p className={'ab-body-text ab-body-text--light'}>
							Our Clean Beauty program evaluates every product against a strict list of prohibited ingredients —
							sulfates, parabens, mineral oil, formaldehyde, and more. If it does not pass, it does not make the shelf.
						</p>
						<div className={'ab-clean-badges'}>
							{['No Sulfates', 'No Parabens', 'No Mineral Oil', 'No Formaldehyde', 'Vegan Options', 'Dermatologist Tested'].map((b) => (
								<span key={b} className={'ab-clean-badge'}>{b}</span>
							))}
						</div>
					</div>
					<div className={'ab-clean-right'}>
						<div className={'ab-clean-card'}>
							<div className={'ab-clean-card-icon'}>🔬</div>
							<Typography className={'ab-clean-card-title'}>2,500+</Typography>
							<Typography className={'ab-clean-card-sub'}>Banned Ingredients</Typography>
						</div>
						<div className={'ab-clean-card'}>
							<div className={'ab-clean-card-icon'}>✅</div>
							<Typography className={'ab-clean-card-title'}>100%</Typography>
							<Typography className={'ab-clean-card-sub'}>Reviewed Products</Typography>
						</div>
						<div className={'ab-clean-card'}>
							<div className={'ab-clean-card-icon'}>🌱</div>
							<Typography className={'ab-clean-card-title'}>60%</Typography>
							<Typography className={'ab-clean-card-sub'}>Vegan Certified</Typography>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    6. JOURNEY — timeline
			═══════════════════════════════════════════ */}
			<section className={'ab-journey'}>
				<div className={'ab-container ab-container--col'}>
					<div className={'ab-section-header'}>
						<span className={'ab-label'}>Our Journey</span>
						<h2 className={'ab-section-title'}>How We Got Here</h2>
					</div>
					<div className={'ab-timeline'}>
						{[
							{ year: '2018', title: 'Founded', desc: 'Started with 50 curated skincare products and a dream to democratize luxury beauty.' },
							{ year: '2019', title: 'Clean Beauty Program', desc: 'Launched our proprietary Clean Beauty standard, banning over 1,000 harmful ingredients.' },
							{ year: '2021', title: '1 Million Customers', desc: 'Reached our first million customers across 30+ countries worldwide.' },
							{ year: '2023', title: '500+ Brands', desc: 'Expanded our portfolio to over 500 premium international and indie brands.' },
							{ year: '2024', title: 'Sustainability Pledge', desc: 'Committed to carbon-neutral operations and 100% recyclable packaging by 2026.' },
						].map(({ year, title, desc }, i) => (
							<div key={year} className={`ab-tl-item ${i % 2 === 0 ? 'ab-tl-left' : 'ab-tl-right'}`}>
								<div className={'ab-tl-content'}>
									<span className={'ab-tl-year'}>{year}</span>
									<h3 className={'ab-tl-title'}>{title}</h3>
									<p className={'ab-tl-desc'}>{desc}</p>
								</div>
								<div className={'ab-tl-dot'} />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    7. EXPERTS — beauty advisors
			═══════════════════════════════════════════ */}
			<section className={'ab-experts'}>
				<div className={'ab-container ab-container--col'}>
					<div className={'ab-section-header'}>
						<span className={'ab-label'}>The Team</span>
						<h2 className={'ab-section-title'}>Meet Our Beauty Experts</h2>
						<p className={'ab-section-desc'}>
							Our in-house team of licensed estheticians, dermatologists, and makeup artists are here to help you find your perfect routine.
						</p>
					</div>
					<div className={'ab-experts-grid'}>
						{[
							{ name: 'Dr. Sarah Kim', role: 'Chief Dermatologist', emoji: '👩‍⚕️', spec: 'Skin Science & Anti-aging' },
							{ name: 'Mia Fontaine', role: 'Head of Curation', emoji: '💄', spec: 'Makeup Artistry & Color' },
							{ name: 'Yuki Tanaka', role: 'Clean Beauty Lead', emoji: '🌿', spec: 'Green Chemistry' },
							{ name: 'Amara Osei', role: 'Inclusivity Director', emoji: '🌈', spec: 'Diverse Skin Tones' },
						].map(({ name, role, emoji, spec }) => (
							<div key={name} className={'ab-expert-card'}>
								<div className={'ab-expert-avatar'}>{emoji}</div>
								<h3 className={'ab-expert-name'}>{name}</h3>
								<span className={'ab-expert-role'}>{role}</span>
								<span className={'ab-expert-spec'}>{spec}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    8. BRANDS — trusted partners
			═══════════════════════════════════════════ */}
			<section className={'ab-partners'}>
				<div className={'ab-container ab-container--col'}>
					<span className={'ab-label ab-label--center'}>Trusted Partners</span>
					<h2 className={'ab-section-title ab-section-title--center'}>Brands We're Proud to Carry</h2>
					<div className={'ab-partners-row'}>
						{sellers.map((seller: any) => (
							<Link key={seller._id} href={`/seller/detail?agentId=${seller._id}`}>
								<div className={'ab-partner-chip'}>
									{seller.memberImage && (
										<img
											src={`${REACT_APP_API_URL}/${seller.memberImage}`}
											alt={seller.memberNick}
											className={'ab-partner-logo'}
										/>
									)}
									{seller.memberFullName ?? seller.memberNick}
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════
			    9. CTA — join community
			═══════════════════════════════════════════ */}
			<section className={'ab-cta'}>
				<div className={'ab-cta-inner'}>
					<span className={'ab-eyebrow ab-eyebrow--dark'}>Join the Community</span>
					<h2 className={'ab-cta-title'}>Start Your Beauty Journey Today</h2>
					<p className={'ab-cta-sub'}>
						Discover thousands of products, get personalized recommendations, and connect with beauty lovers worldwide.
					</p>
					<div className={'ab-cta-btns'}>
						<Link href="/product">
							<button className={'ab-btn-primary ab-btn-primary--large'}>Shop the Collection</button>
						</Link>
						<Link href="/quiz">
							<button className={'ab-btn-outline'}>Take the Beauty Quiz</button>
						</Link>
					</div>
				</div>
			</section>

		</div>
	);
};

export default withLayoutBasic(About);
