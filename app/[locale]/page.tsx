import { WelcomeAi } from "@/auth/welcome";
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';

const i18nNamespaces = ['default'];


interface HomeProps {
	params: {
		locale: string;
	};
}

export default async function Home({params: {locale}}: HomeProps) {
	const {t, resources} = await initTranslations(locale, i18nNamespaces);

	return (
		<TranslationsProvider
			namespaces={i18nNamespaces}
			locale={locale}
			resources={resources}>
			<main className="flex min-h-screen flex-col w-full items-center justify-between ">
				<WelcomeAi isUserLoggedIn={false} isMobile={true}/>
			</main>
		</TranslationsProvider>
	);
}
