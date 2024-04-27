// page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { WelcomeAi } from "@/auth/welcome";
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import { useIsMobile } from "@/useIsMobile";

const i18nNamespaces = ['default'];

interface HomeProps {
	params: {
		locale: string;
	};
}

export default function Home({params: {locale}}: HomeProps) {
	const [translations, setTranslations] = useState<{ t: Function, resources: any } | null>(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		initTranslations(locale, i18nNamespaces).then(trans => {
			setTranslations(trans);
		});
	}, [locale]);

	if (!translations) {
		return <div>Loading...</div>; // or any other loading state representation
	}

	const {t, resources} = translations;

	return (
		<TranslationsProvider
			namespaces={i18nNamespaces}
			locale={locale}
			resources={resources}>
			<main className={"border-2 h-screen items-center justify-center"}>
				<WelcomeAi isUserLoggedIn={false} isMobile={isMobile}/>
			</main>
		</TranslationsProvider>
	);
}
