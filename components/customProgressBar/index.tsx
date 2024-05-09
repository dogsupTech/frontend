import { FC } from "react";

interface CustomProgressBarProps {
	value: number;
	backgroundColor?: string;
	bufferColor?: string;
}

export const CustomProgressBar: FC<CustomProgressBarProps> = ({
																  value,
																  backgroundColor,
																  bufferColor,
															  }) => {
	const containerStyle: React.CSSProperties = {
		width: '80%',
		height: '16px',
		backgroundColor: bufferColor || 'lightgray',
		borderRadius: '8px',
		overflow: 'hidden',
		border: '1px solid black'
	};

	const progressStyle: React.CSSProperties = {
		width: `${value}%`,
		height: '100%',
		backgroundColor: backgroundColor || 'blue',
		borderRadius: '8px',
		transition: 'width 0.3s ease-in-out',
	};

	return (
		<div style={containerStyle}>
			<div style={progressStyle}></div>
		</div>
	);
};
