import React, { useState } from "react";
import cn from "clsx";
import s from "@components/vetai/auth/Form.module.css";
import { LOGIN_AUTH_VIEW } from "@/auth/welcome";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components/"
import { errorToast, successToast } from "@/auth/index";

const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address").min(1, 'Email is required'),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const FORGOT_PASSWORD_URL = "/api/auth/reset-password";

const handleForgotPassword = async (email: string) => {
	try {
		const response = await fetch(FORGOT_PASSWORD_URL, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({email, origin: "VETAI"}),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const ForgotPassword: React.FC<{
	isMobile: boolean,
	setAuthView: any
}> = ({isMobile, setAuthView}) => {
	const {t} = useTranslation();
	const {register, handleSubmit, formState: {errors}} = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(forgotPasswordSchema)
	});
	const [loading, setLoading] = useState(false);

	const handleFormSubmit = async (data: { email: string }) => {
		try {
			setLoading(true);
			await handleForgotPassword(data.email);
			successToast("We've sent you a link to complete your password reset. Check your email!");
		} catch (e) {
			console.error(e);
			errorToast("Error. Try again! If the problem persists, please contact info@dogsup.co");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4 bg-white shadow rounded-lg">
			<Toaster position="top-center" reverseOrder={false}/>
			<h2 className={`text-lg ${isMobile ? 'text-center' : 'text-left'} font-semibold`}>
				{t('forgotPassword.title')}
			</h2>
			<WhiteSpace height="25px"/>
			<div className="text-center max-w-md mx-auto">
				{t('forgotPassword.text')}
			</div>
			<WhiteSpace height="15px"/>
			<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
				<label className="block text-sm font-medium text-gray-700">
					{t('forgotPassword.email')}
					<input type="email" {...register("email")}
						   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
					{errors.email && (
						<p className="text-red-500 text-xs italic">{errors.email.message}</p>
					)}
				</label>
				<WhiteSpace height="40px"/>
				<div className="flex justify-center space-x-4">
					<SmallPrimaryButtonNew
						isLoading={loading}
						isDisabled={loading}
						text={t('forgotPassword.sendResetLink')}
						isMobile={isMobile}
					/>
					<WhiteSpace width="20px"/>
					<SmallPrimaryButtonNew
						isDisabled={loading}
						isWhite={true}
						border={true}
						text={t('forgotPassword.goBack')}
						onClick={() => setAuthView(LOGIN_AUTH_VIEW)}
						isMobile={isMobile}
						isLoading
					/>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
