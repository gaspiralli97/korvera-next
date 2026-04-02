import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface Segment {
	label: string;
	resultLabel: string;
	color: string;
	textColor: string;
	probability: number;
}

const SEGMENTS: Segment[] = [
	{ label: '10% OFF',   resultLabel: '10% off on all products',          color: '#F8BBD0', textColor: '#880E4F', probability: 20 },
	{ label: 'FREE SHIP', resultLabel: 'Free shipping on your next order',  color: '#FCE4EC', textColor: '#AD1457', probability: 25 },
	{ label: '5% OFF',    resultLabel: '5% off on all products',            color: '#F48FB1', textColor: '#fff',    probability: 20 },
	{ label: '$10 OFF',   resultLabel: '$10 voucher on orders over $50',    color: '#E91E63', textColor: '#fff',    probability: 8  },
	{ label: '15% OFF',   resultLabel: '15% off on skincare products',      color: '#F06292', textColor: '#fff',    probability: 10 },
	{ label: 'SAMPLE',    resultLabel: 'Free beauty sample with any order', color: '#FDDDE6', textColor: '#880E4F', probability: 7  },
	{ label: '$20 OFF',   resultLabel: '$20 voucher on orders over $80',    color: '#C2185B', textColor: '#fff',    probability: 5  },
	{ label: '20% OFF',   resultLabel: '20% off on makeup products',        color: '#E91E8C', textColor: '#fff',    probability: 5  },
];

const SEG_COUNT = SEGMENTS.length;
const SEG_DEG   = 360 / SEG_COUNT;
const CX = 180, CY = 180, R = 155;

const toRad = (deg: number) => (deg * Math.PI) / 180;

function segPath(i: number): string {
	const s  = toRad(i * SEG_DEG - 90);
	const e  = toRad((i + 1) * SEG_DEG - 90);
	const x1 = CX + R * Math.cos(s);
	const y1 = CY + R * Math.sin(s);
	const x2 = CX + R * Math.cos(e);
	const y2 = CY + R * Math.sin(e);
	return `M${CX} ${CY} L${x1.toFixed(2)} ${y1.toFixed(2)} A${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
}

function textAttrs(i: number): { x: string; y: string; rotate: number } {
	const mid         = i * SEG_DEG + SEG_DEG / 2;
	const screenAngle = mid - 90;
	const midRad      = toRad(screenAngle);
	const x           = (CX + R * 0.62 * Math.cos(midRad)).toFixed(2);
	const y           = (CY + R * 0.62 * Math.sin(midRad)).toFixed(2);
	const rotate      = screenAngle > 90 || screenAngle < -90 ? mid + 180 : mid;
	return { x, y, rotate };
}

function weightedRandom(): number {
	const total = SEGMENTS.reduce((s, seg) => s + seg.probability, 0);
	let r = Math.random() * total;
	for (let i = 0; i < SEGMENTS.length; i++) {
		r -= SEGMENTS[i].probability;
		if (r <= 0) return i;
	}
	return SEGMENTS.length - 1;
}

interface SpinWheelProps {
	onClose: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onClose }) => {
	const router         = useRouter();
	const wheelRef       = useRef<HTMLDivElement>(null);
	const rotationRef    = useRef(0);
	const [spinning, setSpinning] = useState(false);
	const [result, setResult]     = useState<Segment | null>(null);

	const spin = useCallback(() => {
		if (spinning || result) return;

		const winner      = weightedRandom();
		const targetBase  = ((-(winner * SEG_DEG + SEG_DEG / 2)) % 360 + 360) % 360;
		const currentNorm = rotationRef.current % 360;
		const extra       = (targetBase - currentNorm + 360) % 360;
		const target      = rotationRef.current + 5 * 360 + (extra === 0 ? 360 : extra);

		rotationRef.current = target;
		setSpinning(true);

		if (wheelRef.current) {
			wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
			wheelRef.current.style.transform  = `rotate(${target}deg)`;
		}

		setTimeout(() => {
			setSpinning(false);
			setResult(SEGMENTS[winner]);
		}, 4200);
	}, [spinning, result]);

	return (
		<div className="sw-overlay">
			<div className="sw-modal">
				<button className="sw-close" onClick={onClose} aria-label="Close">✕</button>

				{!result ? (
					<>
						<div className="sw-header">
							<span className="sw-title">Your Glow Reward</span>
							<p className="sw-subtitle">Spin for an exclusive beauty deal — yours to keep!</p>
						</div>

						<div className="sw-wheel-wrap">
							<div className="sw-pointer" />
							<div className="sw-wheel-inner" ref={wheelRef}>
								<svg viewBox="0 0 360 360" className="sw-svg">
									{SEGMENTS.map((seg, i) => {
										const { x, y, rotate } = textAttrs(i);
										return (
											<g key={i}>
												<path d={segPath(i)} fill={seg.color} stroke="#fff" strokeWidth="2" />
												<text
													x={x}
													y={y}
													textAnchor="middle"
													dominantBaseline="middle"
													fill={seg.textColor}
													fontSize="10"
													fontWeight="700"
													fontFamily="'Helvetica Neue', Arial, sans-serif"
													transform={`rotate(${rotate}, ${x}, ${y})`}
												>
													{seg.label}
												</text>
											</g>
										);
									})}
									<circle cx={CX} cy={CY} r="24" fill="#fff" stroke="#F8BBD0" strokeWidth="3" />
									<text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize="20">
										{'💄'}
									</text>
								</svg>
							</div>
						</div>

						<button
							className={`sw-btn${spinning ? ' sw-btn--disabled' : ''}`}
							onClick={spin}
							disabled={spinning}
						>
							{spinning ? 'Spinning...' : 'SPIN NOW'}
						</button>

						<p className="sw-note">One spin per visit. Offer valid for 24 hours.</p>
					</>
				) : (
					<div className="sw-result">
						<span className="sw-result-emoji">🎉</span>
						<h2 className="sw-result-heading">Congratulations!</h2>
						<div className="sw-result-card" style={{ background: result.color }}>
							<span className="sw-result-label">{result.label}</span>
						</div>
						<p className="sw-result-desc">{result.resultLabel}</p>
						<button
							className="sw-btn"
							onClick={() => { onClose(); router.push('/product'); }}
						>
							Shop Now ✨
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SpinWheel;
