// Import necessary hooks and components from Next.js and other libraries
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated import for Next.js 14
import { useIsMobile } from "@/useIsMobile";
import LoadingDots from "@/components/LoadingDots";
import { CompleteSignUpForm } from "@/components/auth/completeSignUpForm";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/app/i18n";

const i18nNamespaces = ['default'];


interface CompleteSignupProps {
	params: {
		locale: string;
	};
}

// Main signup component with proper types for router queries
export default function CompleteSignup({params: {locale}}: CompleteSignupProps) {
	const router = useRouter(); // Updated to use new useRouter from 'next/navigation'

	const isMobile = useIsMobile();
	const searchParams = useSearchParams(); // Hook to get search parameters

	// Extract parameters using the searchParams object
	const email = searchParams.get('email');
	const token = searchParams.get('token');
	const redirect = searchParams.get('redirect');
	const origin = searchParams.get('origin');

	// Check for the presence of all necessary query parameters
	if (!email || !token || !redirect || !origin) {
		return <LoadingDots/>;
	}
	const [translations, setTranslations] = useState<{ t: Function, resources: any } | null>(null);

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
			<div className="flex justify-center items-center">
				<CompleteSignUpForm
					isMobile={isMobile}
					token={token.toString()}
					email={email.toString()}
					redirectUrl={redirect.toString()}
					origin={origin.toString()}
				/>
			</div>
		</TranslationsProvider>
	);
}

