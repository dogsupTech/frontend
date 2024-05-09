import React, { useState } from "react";
import cn from "clsx";
import s from "./Form.module.css";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import { CustomAdieu, CustomP } from "@/components/texts";
import { useTranslation } from "next-i18next";


export const YouAreOnTheWaitList: React.FC<{ email: string, isMobile: boolean; origin: string }> = ({
																								 email,
																								 origin,
																								 isMobile,
																							 }) => {


	console.log("origin", origin)
	const {t} = useTranslation()
	const [view, setView] = useState("WAITLIST_VIEW");

	const title = t('completeSignup.welcomeToDogsup.title')
	const textEcom = t('completeSignup.welcomeToDogsup.text')

	const titleVetAI = t('completeSignup.vetAI.title')
	const textVetAI = t('completeSignup.vetAI.text')

	const space = isMobile ? 37 : 50;
	return (
		<div className={cn(s.formWrapper)}>
			{view === "WAITLIST_VIEW" && (
				<>
					<YouAreOnTheWaitListComponent
						title={
							origin === VET_AI_ORIGIN ? titleVetAI : title
						}
						text={
							origin == VET_AI_ORIGIN ? textVetAI : textEcom
						}
						isMobile={isMobile}
						email={email}
					/>
					<SmallPrimaryButtonNew
						onClick={() => setView("CAPTURE_MORE_USER_DATA_VIEW")}
						text={t('completeSignup.vetAI.next') || ''}
					/>
				</>
			)} {view === "CAPTURE_MORE_USER_DATA_VIEW" && (
			<CaptureDogInfo isMobile={isMobile}/>
		)}
		</div>
	);
}



const YouAreOnTheWaitListComponent: React.FC<{
	email: string,
	isMobile: boolean;
	title: string,
	text: string
}> = ({
		  email,
		  isMobile,
		  title,
		  text
	  }) => {
	const titleFontSize = isMobile ? 32 : 34;
	const breadTextFontSize = isMobile ? 16 : 18;
	const letterSpacing = isMobile ? "-0.36px" : "-0.04em";
	const titleLetterSpacing = isMobile ? "-0.68px" : "-0.68px";
	const space = isMobile ? 37 : 50;

	return (
		<div className={cn(s.formWrapper)}>
			<WhiteSpace height={"60px"}/>
			<CustomAdieu letterSpacing={titleLetterSpacing} textAlign={"center"}
						 fontSize={titleFontSize + "px"}>
				{title}
			</CustomAdieu>
			<WhiteSpace height={space + "px"}/>
			<CustomP letterSpacing={letterSpacing} fontWeight={600} lineHeight={"150%"} textAlign={"center"}
					 fontSize={breadTextFontSize + "px"}>
				{text}
			</CustomP>
			<WhiteSpace height={space + "px"}/>
		</div>
	)

}
