import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import { errorToast } from "@/auth/index";

export const invalid_type_error = "Invalid type error";
export const required_error = "Required error";

const signupSchema = z.object({
	email: z.string({invalid_type_error, required_error}).email().min(1, 'Value is too short'),
});

type SignupSchema = z.infer<typeof signupSchema>;

const handleSignUp = async (email: string, origin: string) => {
	const SIGNUP_LINK_URL = "/api/auth/signup";
	try {
		const response = await fetch(SIGNUP_LINK_URL, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({email, origin}),
		});
		if (!response.ok) {
			throw new Error(`Error: ${response.status} - ${await response.text()}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error);
		throw new Error('Error when signing up');
	}
};

const SignUp: React.FC<{
	isMobile: boolean,
	setAuthView: any
}> = ({isMobile, setAuthView}) => {
	const {t} = useTranslation();
	const {register, handleSubmit, formState: {errors}} = useForm<SignupSchema>({
		defaultValues: {email: ""},
		resolver: zodResolver(signupSchema)
	});

	const [loading, setLoading] = useState(false);
	const errorMessage = "Error when signing up. Try again! If the problem persists, please contact info@dogsup.co";

	const handleFormSubmit = async (data: { email: string; }) => {
		setLoading(true);
		try {
			await handleSignUp(data.email, "VETAI");
			// onSuccess logic here, e.g., navigate or show success message
		} catch (e) {
			console.error(e);
			errorToast(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<Toaster position="top-center" reverseOrder={false}/>
			<div className="text-xl text-center font-semibold">{t('signup.title')}</div>
			<WhiteSpace height="15px"/>
			<div className="text-base">
				{t('signup.alreadyHaveAnAccount')}{' '}
				<span className="text-blue-500 cursor-pointer" onClick={() => setAuthView('login')}>
                    {t('signup.loginHere')}
                </span>
			</div>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				<label className="block text-sm font-medium text-gray-700">
					{t('signup.email')}
					<input type="email" {...register('email')}
						   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
					{errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
				</label>
				<WhiteSpace height="40px"/>
				<SmallPrimaryButtonNew isLoading={loading} text={t('signup.letsGo')} isMobile={isMobile}/>
			</form>
		</div>
	);
};

export default SignUp;
