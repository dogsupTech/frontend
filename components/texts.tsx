import React from 'react';

export type TextProp = {
	text?: string;
	color?: string;
	className?: string;
	textAlign?: string;
	textDecoration?: string;
	scaleFactor?: number;
	children?: React.ReactNode;  // Add this line to include children in the type
};

// Utility functions for dynamic properties
const getTextAlignment = (textAlign: string) => {
	switch (textAlign) {
		case 'left':
			return 'text-left';
		case 'right':
			return 'text-right';
		case 'center':
			return 'text-center';
		case 'justify':
			return 'text-justify';
		default:
			return '';
	}
};

const getTextDecoration = (textDecoration: string) => {
	switch (textDecoration) {
		case 'underline':
			return 'underline';
		case 'line-through':
			return 'line-through';
		case 'no-underline':
			return 'no-underline';
		default:
			return '';
	}
};

export const H1 = ({text, children, color, textAlign, className}: TextProp) => (
	<h1 className={`font-adieu font-bold text-[112px] leading-[119px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h1>
);

export const H2 = ({text, children, color, textAlign, className}: TextProp) => (
	<h2 className={`font-adieu font-bold text-[82px] leading-[90px] -tracking-[0.04em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h2>
);

export const H3 = ({text, children, color, textAlign, className}: TextProp) => (
	<h3 className={`font-adieu font-bold text-[64px] leading-[67px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h3>
);

export const H4 = ({text, children, color, textAlign, className}: TextProp) => (
	<h4 className={`font-adieu font-bold text-[58px] leading-[55px] -tracking-[0.04em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h4>
);

export const H4AndAHalf = ({text, children, color, textAlign, className}: TextProp) => (
	<h4 className={`font-adieu font-bold text-[50px] leading-[55px] -tracking-[0.04em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h4>
);

export const H5 = ({text, children, color, textAlign, className}: TextProp) => (
	<h5 className={`font-adieu font-bold text-[32px] leading-[38px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h5>
);

export const H6 = ({text, children, color, textAlign, className}: TextProp) => (
	<h6 className={`font-adieu font-bold text-[28px] inline-block leading-[34px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h6>
);

export const VetAIBoxText = ({text, children, color, textAlign, scaleFactor, className}: TextProp & {
	scaleFactor?: number
}) => (
	<h6 className={`font-adieu font-bold ${scaleFactor ? `text-[${24 * scaleFactor}px] leading-[${34 * scaleFactor}px]` : 'text-[24px] leading-[34px]'} -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h6>
);

export const H7 = ({text, children, color, textAlign, textDecoration, className}: TextProp) => (
	<h6 className={`font-adieu font-bold text-[18px] inline-block leading-[34px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${getTextDecoration(textDecoration!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h6>
);

export const H8 = ({text, children, color, textAlign, className}: TextProp) => (
	<h6 className={`font-adieu font-bold text-[16px] inline-block leading-[34px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
		{text}
		{children}
	</h6>
);

// Add other headings and components as needed
