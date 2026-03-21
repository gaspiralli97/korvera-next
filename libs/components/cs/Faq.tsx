import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('products');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		products: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Are the products on Korvera authentic and genuine?',
				content:
					'Yes, all products listed on Korvera are 100% authentic. We only work with verified sellers and authorized distributors to ensure every product is genuine.',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What categories of beauty products do you offer?',
				content:
					'We offer a wide range including Skincare, Makeup, Haircare, Body Care, Fragrances, and Wellness products from both local and international brands.',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How can I find products suitable for my skin type?',
				content:
					'Use our skin type filter on the product listing page. You can filter by Normal, Dry, Oily, Combination, or Sensitive skin type to find products formulated specifically for you.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Do products on Korvera have expiration dates?',
				content:
					'Yes, all products display their expiration date and PAO (Period After Opening) information on the product detail page. We never sell expired or near-expiry products.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'Are the products dermatologist-tested or certified?',
				content:
					'Many products carry certifications such as Dermatologist Tested, Hypoallergenic, Cruelty-Free, Vegan, or Organic. You can find certification badges on each product detail page.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'How do I check a product\'s full ingredient list?',
				content:
					'The complete INCI ingredient list is available on every product detail page. You can also search products by specific ingredients or exclude allergens using our advanced search filters.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What if I have an allergic reaction to a product I purchased?',
				content:
					'Stop using the product immediately and consult a dermatologist. Contact our support team with your order details — we will guide you through our return and refund process.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Do you offer cruelty-free and vegan beauty products?',
				content:
					'Yes, you can filter specifically for Cruelty-Free, Vegan, and Organic certified products. These are clearly marked with certification badges on product cards and detail pages.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I sell my own beauty products through Korvera?',
				content:
					'Absolutely! Register as a seller, submit your brand verification documents, and list your products. See our "For Sellers" FAQ section for more details.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'What does PAO (Period After Opening) mean?',
				content:
					'PAO indicates how many months a product remains safe to use after opening — for example, "12M" means 12 months. Always check PAO to ensure you\'re using products within their safe period.',
			},
		],
		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'What payment methods are accepted on Korvera?',
				content:
					'We accept major credit/debit cards, online banking transfers, and popular digital wallets. All payments are processed securely through our payment portal.',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'Are there any additional fees for using Korvera?',
				content:
					'No hidden fees for buyers. The price you see is the price you pay, excluding applicable shipping fees which are displayed at checkout.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Is installment payment available for larger orders?',
				content:
					'Yes, we offer installment payment options for qualifying orders. Available installment plans are displayed at checkout based on your order total.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Is my payment information secure on Korvera?',
				content:
					'Yes, we use industry-standard SSL encryption and comply with PCI-DSS standards to ensure all your payment information is fully protected.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Can I save my payment details for future purchases?',
				content:
					'Yes, you can securely save your payment method in your account settings for faster checkout on future orders.',
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: "What should I do if my payment fails?",
				content:
					'Check your card details and available balance, then try again. If the issue persists, contact your bank or reach out to our support team for assistance.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'What is your refund policy?',
				content:
					'We offer refunds for unopened products returned within 14 days of delivery. Opened products may be eligible for refund if there is a quality issue or allergic reaction. Contact support to initiate a return.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Are there discounts or promo codes available?',
				content:
					'Yes! We regularly offer promotional codes, seasonal sales, and loyalty point discounts. Subscribe to our newsletter or check the promotions banner to stay updated.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'How long does payment processing take?',
				content:
					'Credit and debit card payments are processed instantly. Bank transfers may take 1-2 business days. Your order is confirmed once payment is successfully processed.',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Do you offer loyalty points or cashback on purchases?',
				content:
					'Yes, every purchase earns you Korvera Beauty Points which can be redeemed as discounts on future orders. Points are credited to your account after order delivery.',
			},
		],
		skincare: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'How do I determine my skin type?',
				content:
					'Wash your face and wait 30 minutes without applying any products. If your skin feels tight — Dry; shiny all over — Oily; shiny only on T-zone — Combination; no issues — Normal; easily irritated — Sensitive.',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'What is the correct order to apply skincare products?',
				content:
					'Apply products from thinnest to thickest consistency: Cleanser → Toner → Essence → Serum → Eye Cream → Moisturizer → Sunscreen (AM) or Face Oil/Night Cream (PM).',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'Can I use multiple active ingredients like Vitamin C and Retinol together?',
				content:
					'It\'s generally not recommended to use Vitamin C and Retinol at the same time. Use Vitamin C in the morning and Retinol at night. Always patch test new actives and introduce them gradually.',
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What is the difference between a serum and a moisturizer?',
				content:
					'Serums are lightweight, fast-absorbing formulas with high concentrations of active ingredients targeting specific concerns. Moisturizers create a protective barrier to lock in hydration. Use serum before moisturizer.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'How often should I exfoliate my skin?',
				content:
					'For most skin types, 2-3 times per week is ideal. Sensitive skin should limit exfoliation to once a week. Over-exfoliating can damage the skin barrier and cause irritation.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'Why is sunscreen important and how do I choose the right SPF?',
				content:
					'Sunscreen protects against UV damage, premature aging, and skin cancer. SPF 30 blocks 97% of UVB rays, SPF 50 blocks 98%. For daily use, SPF 30-50 is recommended. Reapply every 2 hours when outdoors.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'How do I patch test a new skincare product?',
				content:
					'Apply a small amount of the product to the inner forearm or behind the ear. Wait 24-48 hours. If no redness, itching, or irritation appears, the product is likely safe to use on your face.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How long does it take to see results from a new skincare routine?',
				content:
					'Most skincare products need 4-8 weeks of consistent use to show visible results. Skin cell turnover takes about 28 days, so give products enough time before judging effectiveness.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'What ingredients should I avoid for sensitive skin?',
				content:
					'Avoid alcohol (denat.), synthetic fragrances, sulfates, parabens, and harsh exfoliating acids. Look for products labeled Fragrance-Free, Alcohol-Free, or Hypoallergenic.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What is the difference between physical and chemical sunscreen?',
				content:
					'Physical sunscreen (zinc oxide, titanium dioxide) sits on skin and reflects UV rays. Chemical sunscreen absorbs UV rays and converts them to heat. Physical is better for sensitive skin; chemical tends to be more lightweight.',
			},
		],
		sellers: [
			{
				id: '00f5a45ed8897f8090116a04',
				subject: 'How can I become a seller on Korvera?',
				content:
					'Register an account, select "Seller" as your member type, and contact our admin team with your brand information and product catalog. We will review and activate your seller account.',
			},
			{
				id: '00f5a45ed8897f8090116a62',
				subject: 'What documents are required to register as a seller?',
				content:
					'You will need: business registration certificate, product authenticity certificates, brand authorization letter (if reselling), and product safety/compliance documentation.',
			},
			{
				id: '00f5a45ed8897f8090116a63',
				subject: 'How do I list my products on the platform?',
				content:
					'Once approved, use the seller dashboard to add products. Fill in all details including ingredients, certifications, skin type compatibility, variants, and high-quality product images.',
			},
			{
				id: '00f5a45ed8897f8090116a64',
				subject: 'What are the most effective ways to promote my products on Korvera?',
				content:
					'Optimize product descriptions with relevant keywords, ensure high-quality images, collect genuine customer reviews, maintain competitive pricing, and participate in Korvera promotional campaigns.',
			},
			{
				id: '00f5a45ed8897f8090116a65',
				subject: 'How are seller payments processed?',
				content:
					'Seller earnings are calculated after deducting the platform commission and transferred to your registered bank account on a bi-weekly basis.',
			},
			{
				id: '00f5a45ed8897f8090116a66',
				subject: 'How do I handle product returns and customer complaints?',
				content:
					'Respond to customer inquiries within 24 hours through the Q&A system. For returns, follow the platform\'s return policy and maintain a good seller rating to stay in good standing.',
			},
			{
				id: '00f5a45ed8897f8090116a67',
				subject: 'What quality standards must my products meet?',
				content:
					'All products must comply with local cosmetics safety regulations, have valid expiry dates, accurate ingredient lists, and proper labeling. Products with false claims will be removed immediately.',
			},
			{
				id: '00f5a45ed8897f8090116a68',
				subject: 'Can international brands sell on Korvera?',
				content:
					'Yes, international brands are welcome. Products must meet local import regulations and all labels must include information in the required local language(s).',
			},
			{
				id: '00f5a45ed8897f8090116a69',
				subject: 'How do I track my sales and performance analytics?',
				content:
					'Your seller dashboard provides real-time analytics including sales volume, product views, customer ratings, and conversion rates to help you optimize your listings.',
			},
			{
				id: '00f5a45ed8897f8090116a70',
				subject: 'What strategies can I use to grow my brand on Korvera?',
				content:
					'Focus on product quality, respond promptly to customer Q&As, encourage genuine reviews, keep your inventory updated, and participate in Korvera\'s featured seller programs.',
			},
		],
		membership: [
			{
				id: '00f5a45ed8897f8090116a05',
				subject: 'Is there a membership or loyalty program on Korvera?',
				content:
					'Our full membership program is coming soon! Currently, all registered users earn Beauty Points on every purchase which can be redeemed for discounts.',
			},
			{
				id: '00f5a45ed8897f8090116a60',
				subject: 'How does the Beauty Points system work?',
				content:
					'You earn 1 point for every $1 spent. Points can be redeemed at checkout — 100 points equals a $1 discount. Points are credited after your order is delivered.',
			},
			{
				id: '00f5a45ed8897f8090116a59',
				subject: 'Will there be premium membership tiers in the future?',
				content:
					'Yes! We are working on Beauty Insider tiers (Silver, Gold, Platinum) with exclusive benefits like early access to new products, special discounts, and free samples.',
			},
			{
				id: '00f5a45ed8897f8090116a58',
				subject: 'Do members get access to exclusive product launches?',
				content:
					'Registered members already receive early access notifications for new arrivals. Premium members (coming soon) will get exclusive pre-launch shopping access.',
			},
			{
				id: '00f5a45ed8897f8090116a57',
				subject: 'How do I create an account on Korvera?',
				content:
					'Click "Sign Up" on the top navigation, fill in your details, verify your email, and you\'re ready to start shopping. Registration is free and takes less than a minute.',
			},
			{
				id: '00f5a45ed8897f8090116a56',
				subject: 'Do members receive birthday discounts or special offers?',
				content:
					'We are introducing birthday discount coupons for all registered members. Add your birthday to your profile settings to receive your special gift when the program launches.',
			},
			{
				id: '00f5a45ed8897f8090116a55',
				subject: 'Can I earn points by writing product reviews?',
				content:
					'Yes! Writing verified purchase reviews earns you bonus Beauty Points. Detailed and helpful reviews earn more points than short ones.',
			},
			{
				id: '00f5a45ed8897f8090116a54',
				subject: 'Do points expire?',
				content:
					'Currently, Beauty Points do not expire. However, once tiered membership launches, unused points from inactive accounts may expire after 12 months of inactivity.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Is there a referral reward for inviting friends to Korvera?',
				content:
					'A referral program is planned for our upcoming membership launch. You will earn bonus points when friends you refer make their first purchase.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Can I use my points together with promotional codes?',
				content:
					'Points redemption and promo codes cannot be combined in a single order currently. We are working to allow combined use in a future platform update.',
			},
		],
		community: [
			{
				id: '00f5a45ed8897f8090116a06',
				subject: 'What can I post in the Korvera Beauty Community?',
				content:
					'Share skincare routines, makeup tutorials, product reviews, beauty tips, before/after experiences, ingredient discussions, and questions about specific skin concerns.',
			},
			{
				id: '00f5a45ed8897f8090116a44',
				subject: 'How do I participate in the community section?',
				content:
					'Create a free account, go to the Community page, and start posting or commenting. Share your beauty journey and connect with others who share your interests.',
			},
			{
				id: '00f5a45ed8897f8090116a45',
				subject: 'Are there community guidelines I should follow?',
				content:
					'Yes. Be respectful, share accurate product information, avoid spam, do not post misleading claims about products, and do not share personal contact details publicly.',
			},
			{
				id: '00f5a45ed8897f8090116a46',
				subject: 'What should I do if I see misinformation about a product or ingredient?',
				content:
					'You can reply with correct information and cite your sources. If the post contains harmful or false claims, report it to our admin team for review.',
			},
			{
				id: '00f5a45ed8897f8090116a47',
				subject: 'Can I ask for skincare advice from other members?',
				content:
					'Absolutely! The community is a great place to ask for advice. However, for medical skin conditions, always consult a licensed dermatologist.',
			},
			{
				id: '00f5a45ed8897f8090116a48',
				subject: 'Can I share my personal skincare routine or product recommendations?',
				content:
					'Yes! Personal routines and honest product recommendations are some of the most valuable content in our community. Feel free to share what works for you.',
			},
			{
				id: '00f5a45ed8897f8090116a49',
				subject: 'How do I protect my privacy in the community?',
				content:
					'Avoid sharing personal contact information publicly. Use a username instead of your real name if you prefer privacy. You can control what appears on your public profile in account settings.',
			},
			{
				id: '00f5a45ed8897f8090116a50',
				subject: 'Are beauty influencers or professionals active in the community?',
				content:
					'Yes, we have verified beauty consultants and skincare professionals who participate in the community. Their profiles are marked with a Consultant badge.',
			},
			{
				id: '00f5a45ed8897f8090116a51',
				subject: 'Can I report a post or comment that violates community guidelines?',
				content:
					'Yes, click the report button on any post or comment. Our moderation team reviews reports within 24 hours and takes appropriate action.',
			},
			{
				id: '00f5a45ed8897f8090116a52',
				subject: 'Is the community moderated?',
				content:
					'Yes, our community is actively moderated by our team. We also have AI-assisted content filtering to catch violations quickly and maintain a positive environment.',
			},
		],
		other: [
			{
				id: '00f5a45ed8897f8090116a40',
				subject: 'How can I contact Korvera customer support?',
				content:
					'You can reach us through the Inquiry form on this page, via email at support@korvera.uz, or through the live chat widget available on the website.',
			},
			{
				id: '00f5a45ed8897f8090116a39',
				subject: 'Can beauty brands advertise on Korvera?',
				content:
					'We offer partnership and advertising opportunities for beauty brands. Contact our partnerships team through the inquiry form for sponsorship and promotional collaboration details.',
			},
			{
				id: '00f5a45ed8897f8090116a38',
				subject: 'Do you collaborate with beauty influencers or content creators?',
				content:
					'Yes! We have an influencer and content creator program. If you are a beauty content creator interested in collaboration, please reach out through our partnerships inquiry form.',
			},
			{
				id: '00f5a45ed8897f8090116a36',
				subject: 'Can I contribute beauty articles or skincare guides to Korvera?',
				content:
					'We welcome contributions from skincare professionals and beauty experts. Contact us through the inquiry form with your proposed topic and your credentials.',
			},
			{
				id: '00f5a45ed8897f8090116a35',
				subject: 'Is there a referral program for recommending Korvera to friends?',
				content:
					'A referral rewards program is coming soon. Stay tuned for our announcement — you will earn bonus points for every friend you refer who makes a purchase.',
			},
			{
				id: '00f5a45ed8897f8090116a34',
				subject: 'Do you offer affiliate marketing partnerships?',
				content:
					'Yes, we have an affiliate program for content creators and bloggers. Apply through our affiliate program page to earn commission on sales generated through your links.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Do you host beauty events or skincare workshops?',
				content:
					'We periodically host online beauty masterclasses, skincare Q&A sessions with dermatologists, and virtual brand launch events. Follow us on social media for announcements.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Are there career opportunities at Korvera?',
				content:
					'We are a growing beauty platform always looking for passionate talent. Check our careers page or send your resume to careers@korvera.uz for current and future openings.',
			},
			{
				id: '00f5a45ed8897f8090116a31',
				subject: 'How can I stay updated on new product launches and promotions?',
				content:
					'Subscribe to our newsletter, follow us on social media, and enable notifications in your account settings to never miss a new launch or exclusive deal.',
			},
			{
				id: '00f5a45ed8897f8090116a30',
				subject: 'How do I report a counterfeit or suspicious product listing?',
				content:
					'Click the "Report" button on the product page or contact our support team directly. We take authenticity very seriously and will investigate all reports immediately.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'products' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('products');
						}}
					>
						Products
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'skincare' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('skincare');
						}}
					>
						Skincare Tips
					</div>
					<div
						className={category === 'sellers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('sellers');
						}}
					>
						For Sellers
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
