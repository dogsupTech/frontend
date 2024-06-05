"use client";

import React, { useEffect, useState } from 'react';
import { WelcomeAi } from "@/components/auth/welcome";
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import { useIsMobile } from "@/useIsMobile";
import { Dog, useAuth } from "@/components/auth/auth";
import { H3, H4, H6, P1 } from "@/components/texts";
import Chat from "@/components/Chat";
import { WhiteSpace } from "@/components";

interface ITranslations {
	t: (key: string) => string;
	resources: Record<string, any>;
}

interface HomeProps {
	params: {
		locale: string;
	};
}

export default function Home({params: {locale}}: HomeProps) {
	const isMobile = useIsMobile();
	const {user, userData, isLoading} = useAuth();
	const [translations, setTranslations] = useState<ITranslations | null>(null);

	useEffect(() => {
		initTranslations(locale, ['default']).then(trans => {
			setTranslations(trans);
		});
	}, [locale]);

	if (!translations || isLoading) {
		return <div>Loading...</div>; // or any other loading state representation
	}

	const formatDate = (date: Date | string | null): string => {
		if (typeof date === 'string') {
			date = new Date(date); // Convert string to Date object
		}

		return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "N/A";
	}

	const dogData = userData?.dog;
	let userDog: Dog | null = null;
	if (dogData) {
		const birthDate = dogData.birthDate ? new Date(dogData.birthDate) : null;
		userDog = new Dog(dogData.dogName, dogData.sex, dogData.selectedBreed, birthDate!);
	}

	return (
		<TranslationsProvider
			namespaces={['default']}
			locale={locale}
			resources={translations.resources}>
			<main className="border-2 h-screen w-full flex items-center justify-center">
				{
					!user ? <WelcomeAi isUserLoggedIn={false} isMobile={isMobile}/> :
						<div className={"w-[80%]"}>
							<H6 textAlign={"center"}>DogTalk behaviour coach</H6>
							{
								userData?.dog ? Object.entries(userData.dog).map(([key, value]) => {
									const displayValue = key === 'birthDate' ? formatDate(value as Date) : value;
									return (
										<div key={key}>
											<P1>{key}: {displayValue} </P1>
										</div>
									);
								}) : <H4 textAlign={"center"}>No dog data found :(</H4>
							}
							<WhiteSpace height={"50px"}/>
							<Chat dog={userDog!} isMobile/>
						</div>
				}
			</main>
		</TranslationsProvider>
	);
}
