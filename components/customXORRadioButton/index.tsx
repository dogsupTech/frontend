import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { P1 } from "@/components/texts";

interface CustomXORRadioButtonProps {
	options: string[];
	selectedOption: string;
	onChange: (selectedOption: string) => void;
}

export const CustomXORRadioButton: FC<CustomXORRadioButtonProps> = ({
																		options,
																		selectedOption,
																		onChange,
																	}) => {

	const handleOptionClick = (option: string) => {
		onChange(option);
	};

	const {t} = useTranslation()

	return (
		<div className="flex flex-col justify-center w-full items-center">
			{options.map((option, index) => (
				<div onClick={() => handleOptionClick(option)} key={index}
					 className="flex cursor-pointer flex-row my-[10px] justify-between items-center w-full">
					<P1>{t('vetai.detailinfopage.condition.' + option)} </P1>
					<div
						onClick={() => handleOptionClick(option)}
						className={`rounded-[100px] cursor-pointer border-black w-[18px] h-[18px] ${
							selectedOption === option
								? "border-[4px] bg-[#FA85C4]"
								: "border-[2px] bg-white"
						}`}
					>
					</div>
				</div>
			))}
		</div>
	);
};
