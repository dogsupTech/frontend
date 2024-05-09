// page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { WelcomeAi } from "@/components/auth/welcome";
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import { useIsMobile } from "@/useIsMobile";
import { useAuth } from "@/components/auth/auth";

const i18nNamespaces = ['default'];

interface HomeProps {
	params: {
		locale: string;
	};
}

export default function Home({params: {locale}}: HomeProps) {
	const isMobile = useIsMobile();

	useEffect(() => {
		initTranslations(locale, i18nNamespaces).then(trans => {
			setTranslations(trans);
		});
	}, [locale]);
	const {user, userData, isLoading, refreshUserData} = useAuth();

	const [translations, setTranslations] = useState<{ t: Function, resources: any } | null>(null);

	if (!translations || 	!user && !isLoading) {
		return <div>Loading...</div>; // or any other loading state representation
	}

	const {t, resources} = translations;

	return (
		<TranslationsProvider
			namespaces={i18nNamespaces}
			locale={locale}
			resources={resources}>
			<main className={"border-2 h-screen items-center justify-center"}>
				{
					 !userData ? <WelcomeAi isUserLoggedIn={false} isMobile={isMobile}/> :
						// dog things
						<div>
							<h1>Welcome back, {userData?.email}!</h1>
							{
								userData && Object.entries(userData).map(([key, value]) => {
									return (
										<div key={key}>
											{key}: {value}
										</div>
									)
								})
							}
							{
								userData?.dog && Object.entries(userData).map(([key, value]) => {
									return (
										<div key={key}>
											{key}: {value}
										</div>
									)
								})
							}
						</div>
				}
			</main>
		</TranslationsProvider>
	);
}
