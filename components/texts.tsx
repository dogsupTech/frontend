import React from 'react';

export type TextProp = {
	text?: string;
	color?: string;
	className?: string;
	textAlign?: string;
	textDecoration?: string;
	fontWeight?: number;
	lineHeight?: string;
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
	<h6 className={`font-adieu w-full font-bold text-[28px] inline-block leading-[34px] -tracking-[0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${className}`}>
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



export const VetAiTitle = ({ children, text, color, textAlign, className }: TextProp) => (
	<h6 className={`font-adieu text-[20px] font-normal leading-[21px] tracking-[-0.4px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : 'text-black'} ${className}`}>
		{text}
		{children}
	</h6>
);

export const VetAiLargeTitle = ({ children, text, color, textAlign, className }: TextProp) => (
	<h6 className={`font-adieu text-[22px] font-bold leading-[33px] tracking-[-0.44px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : 'text-black'} ${className}`}>
		{text}
		{children}
	</h6>
);

export const VetAiSubTitle = ({ children, text, color, textAlign, className }: TextProp) => (
	<h6 className={`font-adieu text-[14px] font-normal leading-[21px] tracking-[-0.28px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : 'text-black'} ${className}`}>
		{text}
		{children}
	</h6>
);

export const VetAiUrgencyLabel = ({ children, text, color, textAlign, className }: TextProp) => (
	<h6 className={`font-adieu text-[12px] font-bold leading-[15px] tracking-[-0.2px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : 'text-black'} ${className} flex-grow flex-shrink-0`}>
		{text}
		{children}
	</h6>
);

export type CustomAdieuProp = TextProp & {
	fontWeight?: number;
	lineHeight?: string;
	fontSize?: string;
	letterSpacing?: string;
};

export const CustomAdieu = ({
								children, text, color, textAlign, className, fontWeight, lineHeight, fontSize, letterSpacing
							}: CustomAdieuProp) => (
	<h6 className={`font-adieu ${fontWeight === 900 ? 'font-bold' : `font-${fontWeight}`} ${fontSize ? `text-[${fontSize}]` : 'text-[12px]'} ${lineHeight ? `leading-[${lineHeight}]` : 'leading-[150%]'} ${letterSpacing ? `tracking-[${letterSpacing}]` : '-tracking-[0.8px]'} ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : 'text-black'} ${className}`}>
		{text}
		{children}
	</h6>
);


export const PBig = ({ children, text, color, textAlign, className, textDecoration }: TextProp) => (
	<p className={`font-josefin text-[18px] font-normal leading-[28px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);

export const P1 = ({ children, text, color, textAlign, className, textDecoration }: TextProp) => (
	<p className={`font-josefin text-[22px] font-normal leading-[28px] -tracking-[0.04em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);

export const P2 = ({ children, text, color, textAlign, fontWeight, lineHeight, className, textDecoration }: TextProp) => (
	<p className={`font-josefin ${fontWeight === 400 ? 'font-normal' : `font-${fontWeight}`} text-[16px] ${lineHeight ? `leading-[${lineHeight}]` : 'leading-[21px]'} ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);

export const P3 = ({ children, text, color, textAlign, className, textDecoration }: TextProp) => (
	<p className={`font-adieu text-[14px] font-normal leading-[21px] -tracking-[0.28px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);

export const P4 = ({ children, text, color, textAlign, className, textDecoration }: TextProp) => (
	<p className={`font-josefin text-[12px] font-normal leading-[18px] -tracking-[0.24px] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);

interface CustomPProps extends TextProp {
	fontSize?: string;
	letterSpacing?: string;
}

export const CustomP = ({ children, text, color, textAlign, fontWeight, fontSize, lineHeight, letterSpacing, className, textDecoration }: CustomPProps) => (
	<p className={`font-josefin ${fontWeight ? `font-${fontWeight}` : 'font-normal'} ${fontSize ? `text-[${fontSize}]` : 'text-[16px]'} ${lineHeight ? `leading-[${lineHeight}]` : 'leading-[125%]'} ${letterSpacing ? `tracking-[${letterSpacing}]` : '-tracking-[0.8px]'} ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''} ${getTextDecoration(textDecoration!)} ${className}`}>
		{text}
		{children}
	</p>
);


export type ButtonTextProp = {
	text?: string;
	color?: string;
	isSmall?: boolean;
	textAlign?: string;
};


export const ButtonText = ({ text, color, isSmall, textAlign }: ButtonTextProp) => (
	<p className={`font-josefin font-normal ${isSmall ? 'text-[14px]' : 'text-[16px]'} leading-[21px] uppercase ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''}`}>
		{text}
	</p>
);

export const CompactButtonText = ({ text, color, textAlign }: ButtonTextProp) => (
	<p className={`font-josefin font-semibold text-[16px] leading-[24px] uppercase ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''}`}>
		{text}
	</p>
);

export const SubscribeButtonText = ({ text, color, textAlign }: ButtonTextProp) => (
	<p className={`font-adieu font-normal text-[15px] leading-[22px] tracking-[-0.02em] ${getTextAlignment(textAlign!)} ${color ? `text-[${color}]` : ''}`}>
		{text}
	</p>
);
