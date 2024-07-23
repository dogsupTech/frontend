"use client";

import React, { useEffect, useState } from 'react';
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import useAuthLogic, { useAuth } from "@/components/auth/auth";

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
	<div className="h-screen flex justify-center items-center">Loading...</div>
);

const Error = () => (
	<div className="h-screen flex justify-center items-center text-red-500">Error loading translations.</div>
);

export default function Home({ params: { locale } }: HomeProps) {
	const { userData, isLoading } = useAuth();
	const { login } = useAuthLogic();
	const [translations, setTranslations] = useState<ITranslations | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
		return <Error />;
	}

	if (!translations || isLoading) {
		return <Loading />;
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const credentials = await login(email, password);
			return credentials;
		} catch (e: any) {
			console.log(e);
			alert(e.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<TranslationsProvider
			namespaces={['default']}
			locale={locale}
			resources={translations.resources}>
			<main className="w-full h-screen flex items-center justify-center bg-gray-100">
				{!isLoading && !userData ? (
					<div
						style={{ backgroundImage: `url("/background-login.jpeg")`, backgroundSize: 'cover' }}
						className="h-screen flex w-full justify-center items-center"
					>
						<div className="bg-white rounded-md px-[88px] py-[44px]">
							<div className="text-center flex justify-center flex-col items-center">
								<h2 className="text-xl font-bold mb-6">Logga in</h2>
							</div>
							<form onSubmit={onSubmit} className="min-w-[550px]">
								<div className="mb-4">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="jack@dogsup.co"
										className="w-full py-3 border rounded-md text-lg text-left"
										required
									/>
								</div>
								<div className="mb-4">
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="************"
										className="w-full px-6 py-3 border rounded-md text-lg text-left"
										required
									/>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full py-3 rounded-md text-white text-lg ${isSubmitting ? 'bg-gray-500' : 'bg-black'}`}
								>
									{isSubmitting ? 'Logging in...' : 'LOGGA IN'}
								</button>
							</form>
						</div>
					</div>
				) : (
					<div>
						<p>{translations.t('Welcome,')} {userData?.email}</p>
					</div>
				)}
			</main>
		</TranslationsProvider>
	);
}
