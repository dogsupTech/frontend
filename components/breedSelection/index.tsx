import React, {useState} from 'react';
import {useTranslation} from "next-i18next";
import { PrimaryButton, WhiteSpace } from "@/components";
import { CustomAdieu, H4AndAHalf, H5, P1 } from "@/components/texts";
import { primaryColorTokens } from "@/components/tokens/color";
import StageIndicator from "@/components/StageIndicator";
import { CustomDropdown } from "@/components/customDropDown";

interface BreedSelectionProps {
	isMobile: boolean;
	onNext: (breed: string) => void;
	initBreed: string;
	currentStage?: number;
	selectStage?: (stage: number) => void;
	isEdit?: boolean;
	isSignup?: boolean;
}


const BreedSelection: React.FC<BreedSelectionProps> = ({
														   isMobile,
														   onNext,
														   initBreed,
														   selectStage,
														   currentStage,
														   isEdit,
														   isSignup

													   }) => {
	const [breed, setBreed] = useState<string>(initBreed);
	const [error, setError] = useState<string>("");

	const handleSubmit = () => {
		if (breed) {
			onNext(breed);
			return;
		}
		setError(t('vetai.dogbreedpage.errors.selectbreed') || '');
	};

	const {t} = useTranslation()
	const breedOptions = breedKeysArray.map((breed) => t('breedslist.' + breed));

	let cardFontSize = "32px"
	let cardFontWeight = 900
	let cardLineHeight = "105%"

	if (isMobile) {
		cardFontSize = "20px"
	}

	return (
		<div className={"flex flex-row"}>
			<div className="flex flex-col w-full items-center lg:w-[849px]">

				{!isMobile ? (
					<H4AndAHalf
						textAlign={"center"}>{t('vetai.dogbreedpage.title.first')} {t('vetai.dogbreedpage.title.second')}</H4AndAHalf>
				) : (
					<div className={"flex flex-col items-center"}>
						<H5 textAlign={'center'}>{t('vetai.dogbreedpage.title.first')}</H5>
						<H5 textAlign={'center'}>{t('vetai.dogbreedpage.title.second')}</H5>
					</div>
				)}
				{isMobile ?
					<WhiteSpace height={'44px'}/>
					:
					<WhiteSpace height={"63px"}/>
				}
				<CustomDropdown
					isMobile={isMobile}
					placeholder={t('vetai.dogbreedpage.searchplaceholder')}
					options={breedOptions}
					selectedOption={breed}
					onSelectOption={selectedBreed => {
						setBreed(selectedBreed);
						setError("");
					}}
				/>
				<WhiteSpace height={"30px"}/>
				{breed &&
					<CustomAdieu
						color={primaryColorTokens.virgo}
						fontSize={cardFontSize}
						fontWeight={cardFontWeight}
						lineHeight={cardLineHeight}
					>
						{breed}
					</CustomAdieu>
				}
				<WhiteSpace height={"30px"}/>
				{error &&
					<>
						<P1 color={primaryColorTokens.virgo}>{error}</P1>
						<WhiteSpace height={"30px"}/>
					</>
				}
				<PrimaryButton
					isSmall
					text={t('vetai.nextbutton') || ''}
					onClick={handleSubmit}
				/>
			</div>
			{!isEdit || !isSignup &&
				<div className={"fixed hidden lg:block right-0 fixed top-0 right-0 mt-[300px]"}>
					<StageIndicator
						selectStage={selectStage!}
						currentStage={currentStage!}
						totalStages={6} // Increase the total number of stages
						stageTitles={[
							t('vetai.age'),
							t('vetai.breed'),
							t('vetai.symptoms'),
							t('vetai.summary'),
							t('vetai.assessment1'),
							t('vetai.nextsteps1'),
						]}
					/>
				</div>}
		</div>
	);
};


// Array of Keys
const breedKeysArray: string[] = [
	"pomeranians",
	"toyFoxTerriers",
	"poodlesToy",
	"papillons",
	"chihuahuas",
	"americanEskimoDogsToy",
	"maltese",
	"yorkshireTerriers",
	"affenpinschers",
	"japaneseChin",
	"havanese",
	"italianGreyhounds",
	"brusselsGriffons",
	"miniaturePinschers",
	"chineseCrested",
	"englishToySpaniels",
	"portuguesePodengoPequenos",
	"cotonDeTulear",
	"russellTerriers",
	"tibetanSpaniel",
	"shihTzu",
	"silkyTerriers",
	"xoloitzcuintliToy",
	"poodlesMiniature",
	"schipperkes",
	"americanEskimoDogsMiniature",
	"ratTerriers",
	"dachshundsMiniature",
	"norfolkTerriers",
	"miniatureSchnauzers",
	"manchesterTerriers",
	"norwichTerriers",
	"americanHairlessTerriers",
	"australianTerriers",
	"bichonsFrises",
	"lhasaApsos",
	"manchesterTerriersToy",
	"bostonTerriers",
	"borderTerriers",
	"parsonRussellTerriers",
	"cavalierKingCharlesSpaniels",
	"pekingese",
	"cairnTerriers",
	"pugs",
	"ceskyTerriers",
	"lowchen",
	"westHighlandWhiteTerriers",
	"shetlandSheepdogs",
	"pyreneanShepherds",
	"xoloitzcuintliMiniature",
	"dachshundsStandard",
	"lakelandTerriers",
	"bedlingtonTerriers",
	"foxTerriersSmooth",
	"foxTerriersWire",
	"dandieDinmontTerriers",
	"miniatureBullTerriers",
	"tibetanTerriers",
	"scottishTerriers",
	"beagles13InchesUnder",
	"welshTerriers",
	"beagles13To15Inches",
	"norwegianLundehunds",
	"swedishVallhunds",
	"miniatureAmericanShepherds",
	"cirnechiDellEtna",
	"shibaInu",
	"sealyhamTerriers",
	"basenjis",
	"finnishSpitz",
	"pulik",
	"americanEskimoDogsStandard",
	"petitsBassetsGriffonsVendeens",
	"whippets",
	"germanPinschers",
	"irishTerriers",
	"pumik",
	"frenchBulldogs",
	"spanielsEnglishCocker",
	"mixedRace"
];

// Set of Keys

export default BreedSelection;
