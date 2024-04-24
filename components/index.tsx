import React from 'react';

type ButtonDefaultProps = {
	onClick?: () => void;
	isDisabled?: boolean;
	isWhite?: boolean;
	border?: boolean;
	isMobile: boolean;
	isLoading: boolean;
	text: string;
	isSmall?: boolean;
};

export const LoadingDots = () => <div>Loading...</div>;
const ButtonText = ({text}: { text: string }) => <span>{text}</span>;

export const SmallPrimaryButtonNew = (props: ButtonDefaultProps) => {
	// Define dynamic classes
	const bgColor = props.isWhite ? 'bg-sugar' : 'bg-midnight-dogsup';
	const textColor = props.isWhite ? 'text-midnight-dogsup' : 'text-sugar';
	const borderColor = props.border ? 'border-[1px] border-black' : '';
	const mobileSize = props.isMobile ? 'w-full h-[60px]' : 'min-w-[159px] h-[42px]';

	return (
		<button
			onClick={props.onClick}
			disabled={props.isDisabled}
			className={`
        ${bgColor} 
        ${textColor} 
        ${borderColor} 
        ${mobileSize}
        flex 
        lg:px-[10px]
        justify-center 
        items-center 
        cursor-pointer 
        transition
        duration-300 
        hover:bg-virgot-dogsup
        hover:text-midnight-dogsup
      `}
		>
			{props.isLoading ? <LoadingDots/> : <ButtonText text={props.text}/>}
		</button>
	);
};

export const PrimaryButtonNew = (props: ButtonDefaultProps) => {
	// Define dynamic classes
	const bgColor = props.isWhite ? 'bg-sugar' : 'bg-midnight-dogsup';
	const textColor = props.isWhite ? 'text-midnight-dogsup' : 'text-sugar';
	const borderColor = props.border ? 'border-[1px] border-black' : '';
	const size = props.isMobile ? 'w-full' : 'w-64 h-16';

	return (
		<button
			onClick={props.onClick}
			disabled={props.isDisabled}
			className={`
        ${bgColor} 
        ${textColor} 
        ${borderColor} 
        ${size}
        flex 
        justify-center 
        items-center 
        cursor-pointer 
        transition
        duration-300 
        hover:bg-virgot-dogsup
        hover:text-midnight-dogsup
      `}
		>
			{props.isLoading ? <LoadingDots/> : <ButtonText text={props.text}/>}
		</button>
	);
};

export type WhiteSpaceProps = {
	height?: string;
	width?: string;
	children?: any
};

export const WhiteSpace: React.FC<WhiteSpaceProps> = ({height, width, children}) => {
	return (
		<div
			style={{
				height: height,
				width: width
			}}
			className="bg-transparent" // Add any additional static classes here
		>
			{children}
		</div>
	);
};

export const PrimaryButton = (props: ButtonDefaultProps) => {
	// Define base classes
	let buttonClasses = "flex flex-col items-center justify-center cursor-pointer transition-colors duration-300";

	// Add conditional classes for colors and sizes
	buttonClasses += props.isWhite ? " bg-sugar text-midnight-dogsup" : " bg-midnight-dogsup text-sugar";
	buttonClasses += props.isSmall ? " w-40 h-10" : " w-70 h-13"; // Tailwind does not support custom width and height directly, use closest sizes
	buttonClasses += props.border ? " border border-black" : "";

	// Define hover styles conditionally
	const hoverStyles = props.isWhite ? {backgroundColor: '#f5f5f5', color: '#333'} : {
		backgroundColor: '#333',
		color: '#f5f5f5'
	};

	return (
		<button
			className={buttonClasses}
			onClick={props.onClick}
			disabled={props.isDisabled}
			style={props.isDisabled ? {} : hoverStyles}  // Applying hover styles through inline styles conditionally
		>
			{props.isLoading ? <LoadingDots/> : <ButtonText text={props.text}/>}
		</button>
	);
};
