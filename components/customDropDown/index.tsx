import React, {FC, useEffect, useRef, useState} from "react";
import { WhiteSpace } from "@/components";
import { MagnifyerIcon, PinkChevronIcon } from "@/components/icons";
import { PBig } from "@/components/texts";

interface CustomDropdownProps {
	options: string[];
	selectedOption: string;
	onSelectOption: (option: string) => void;
	placeholder: string;
	isMobile: boolean
}

export const CustomDropdown: FC<CustomDropdownProps> = ({
															isMobile,
															options,
															selectedOption,
															onSelectOption,
															placeholder = "Search or use the dropdown", // Default placeholder text
														}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);

	const filteredOptions = options.filter(option =>
		option.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleOptionClick = (option: string) => {
		onSelectOption(option);
		setIsOpen(false);
		setSearchTerm('');
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const inputHeight = isMobile ? "42px" : "81px"
	const fontSize = isMobile ? "16px" : "22px"

	const [underline, setUnderline] = useState<{ [key: string]: boolean }>()

	return (
		<div ref={dropdownRef} className="relative w-full bg-sugar">
			<div className="flex flex-row w-full">
				<div className="w-full px-4 rounded-tl-[4px] border-[2px] border-black rounded-bl-[4px] cursor-pointer bg-[#fcfbf9]">
					<div className="flex flex-row items-center" onClick={() => setIsOpen(!isOpen)}>
						{!selectedOption && <>
							<MagnifyerIcon/>
							<WhiteSpace width={"20px"}/>
						</>}
						<input
							type="text"
							placeholder={selectedOption || placeholder}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="cursor-pointer focus:outline-none w-full bg-transparent"
							style={{
								height: inputHeight,
								fontFamily: "Josefin Sans",
								fontSize: fontSize,
							}}
						/>
					</div>
				</div>
				<div onClick={()=>setIsOpen(prev=>!prev)} className="flex cursor-pointer items-center px-4 border-black border-t-[2px] border-b-[2px] border-r-[2px] rounded-tr-[4px] rounded-br-[4px]">
					<PinkChevronIcon/>
				</div>
			</div>
			{isOpen && (
				<div className="absolute top-full left-0 w-full bg-sugar border rounded-md mt-1 max-h-[200px] overflow-y-auto">
					{filteredOptions.map((option) => (
						<div
							key={option}
							className="px-4 py-2 cursor-pointer hover:bg-[#C8A9EF3D]"
							onClick={() => handleOptionClick(option)}
							onMouseOver={() => setUnderline((prev) => ({...prev, [option]: true}))}
							onMouseLeave={() => setUnderline((prev) => ({...prev, [option]: false}))}
						>
							<PBig textDecoration={underline && underline[option] && "underline" || ''}> {option}</PBig>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
