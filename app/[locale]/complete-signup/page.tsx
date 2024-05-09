// Import necessary hooks and components from Next.js and other libraries
"use client";

import React, { useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated import for Next.js 14
import { useIsMobile } from "@/useIsMobile";
import LoadingDots from "@/components/LoadingDots";
import { CompleteSignUpForm } from "@/components/auth/completeSignUpForm";


interface CompleteSignupProps {
	params: {
		locale: string;
	};
}

// Main signup component with proper types for router queries
export default function CompleteSignup({params: {locale}}: CompleteSignupProps) {
	const {t} = useTranslation();
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

	return (
		<div className="flex justify-center items-center">
			<CompleteSignUpForm
				isMobile={isMobile}
				token={token.toString()}
				email={email.toString()}
				redirectUrl={redirect.toString()}
				origin={origin.toString()}
			/>
		</div>
	);
}

