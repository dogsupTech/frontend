import React from "react";
import { ButtonText } from './texts';
import LoadingDots from "@/components/LoadingDots";

export type ButtonDefaultProps = {
	isLoading?: boolean;
	isWhite?: boolean;
	text?: string;
	isDisabled?: boolean;
	onClick?: () => void;
	isMobile?: boolean;
	isSmall?: boolean;
	border?: boolean;
};

// Utility function to get background and text color
const getColors = (isWhite: boolean) => ({
	backgroundColor: isWhite ? 'bg-sugar' : 'bg-midnight-dogsup',
	textColor: isWhite ? 'text-midnight-dogsup' : 'text-sugar',
	hoverBgColor: 'hover:bg-virgot-dogsup',
	hoverTextColor: 'hover:text-midnight-dogsup',
});

export const SmallPrimaryButtonNew = (props: ButtonDefaultProps) => {
	const {backgroundColor, textColor, hoverBgColor, hoverTextColor} = getColors(props.isWhite!);
	return (
		<button
			onClick={props.onClick}
			disabled={props.isDisabled}
			className={`
                ${backgroundColor} 
                ${textColor} 
                ${props.border ? 'border border-black' : ''} 
                ${props.isMobile ? 'w-full h-[60px]' : 'min-w-[159px] h-[42px]'}
                flex justify-center items-center cursor-pointer transition duration-300 
                ${hoverBgColor} ${hoverTextColor}
            `}
		>
			{props.isLoading ? <LoadingDots/> : <ButtonText text={props.text}/>}
		</button>
	);
};

export const PrimaryButtonNew = (props: ButtonDefaultProps) => {
	const {backgroundColor, textColor, hoverBgColor, hoverTextColor} = getColors(props.isWhite!);
	return (
		<button
			onClick={props.onClick}
			disabled={props.isDisabled}
			className={`
                ${backgroundColor} 
                ${textColor} 
                ${props.border ? 'border border-black' : ''} 
                ${props.isMobile ? 'w-full h-16' : 'w-64 h-16'}
                flex justify-center items-center cursor-pointer transition duration-300 
                ${hoverBgColor} ${hoverTextColor}
            `}
		>
			{props.isLoading ? <LoadingDots/> : <ButtonText text={props.text}/>}
		</button>
	);
};

export type WhiteSpaceProps = {
	height?: string;
	width?: string;
};

export const WhiteSpace = ({ height, width }: WhiteSpaceProps) => (
	<div style={{ height, width }} className="bg-transparent"></div>
);

export const PrimaryButton = ({ isLoading, isWhite, isSmall, text, isDisabled, onClick, border, isMobile }: ButtonDefaultProps) => {
	const baseStyles = `flex flex-col items-center justify-center cursor-pointer transition-colors`;
	const colorStyles = isWhite ? 'bg-sugar text-midnight' : 'bg-midnight text-sugar';
	const hoverStyles = isWhite ? 'hover:bg-midnight hover:text-sugar' : 'hover:bg-virgo hover:text-midnight';
	const borderStyles = border ? 'border border-black' : '';
	const sizeStyles = isSmall ? 'w-[159px] h-[42px]' : 'w-[280px] h-[53px]';
	const mobileStyles = isMobile ? 'w-full' : '';

	return (
		<button
			className={`${baseStyles} ${colorStyles} ${hoverStyles} ${borderStyles} ${sizeStyles} ${mobileStyles} rounded`}
			onClick={onClick}
			disabled={isDisabled}
		>
			{isLoading ? <LoadingDots/> : <ButtonText isSmall={isSmall} text={text}/>}
		</button>
	);
};
