"use client";

import React, { useEffect, useState } from 'react';
import initTranslations from '../../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';

interface ITranslations {
	t: (key: string) => string;
	resources: Record<string, any>;
}

interface HomeProps {
	params: {
		locale: string;
	};
}



const Loading = () => (
	<div className="w-full h-screen flex items-center justify-center bg-gray-100">Loading...</div>
);

const Error = () => (
	<div className="w-full h-screen flex items-center justify-center bg-gray-100">Error loading translations.</div>
);


export default function Settings({params: {locale}}: HomeProps) {
	const [translations, setTranslations] = useState<ITranslations | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		initTranslations(locale, ['default'])
			.then(trans => {
				setTranslations(trans);
			})
			.catch(() => {
				setError(true);
			});
	}, [locale]);

	if (error) {
		return <Error/>;
	}

	if (!translations) {
		return <Loading/>;
	}

	return (
		<TranslationsProvider
			namespaces={['default']}
			locale={locale}
			resources={translations.resources}>
			<main className="w-full h-screen flex items-center justify-center bg-gray-100">
				settings
			</main>
		</TranslationsProvider>
	);
}
