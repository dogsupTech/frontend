import React, { useState } from "react";
import cn from "clsx";
import s from "./Form.module.css";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components/"
import { H6, H7, P2 } from "@/components/texts";
import { errorToast, successToast } from "@/components/auth/index";
import { LOGIN_AUTH_VIEW } from "@/components/auth/welcome";

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

class UserNotFoundError extends Error {
	constructor(message = 'User not found') {
		super(message);
		this.name = 'UserNotFoundError';
	}
}

const ForgotPassword: React.FC<{ isMobile: boolean, setAuthView: React.Dispatch<any> }> = ({
																							   isMobile,
																							   setAuthView
																						   }) => {

	const {t} = useTranslation();
	const [loading, setLoading] = useState(false);

	const successMessage = "We've sent you a link to complete your password reset. Check your email!";
	const errorMessage = "Error. Try again!" +
		" If the problem persists, please contact info@dogsup.co";

	const errorMessageUserNotFound = "User not found. Sign up!";

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<ForgotPasswordSchema>({
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(forgotPasswordSchema)
	})

	const handleFormSubmit = async (data: { email: string; }) => {
		try {
			setLoading(true)
			await handleForgotPassword(data.email);
			successToast(successMessage);
		} catch (e: any) {
			if (e instanceof UserNotFoundError) {
				errorToast(errorMessageUserNotFound);
			} else {
				errorToast(errorMessage);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn(s.formWrapper)}>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			{!isMobile ?
				<H6>
					{t('forgotPassword.title')}
				</H6>
				:
				<H7>
					{t('forgotPassword.title')}
				</H7>
			}
			<WhiteSpace height={"25px"}/>
			<div className={"max-w-[274px] lg:max-w-[385px]"}>
				<P2 textAlign={"center"}>
					{t('forgotPassword.text')}
				</P2>
			</div>
			<WhiteSpace height={"15px"}/>
			<form
				className={cn(s.form)}
				onSubmit={handleSubmit(handleFormSubmit)}
			>
				{/*EMAIL*/}
				<div className={cn(s.formSection)}>
					<div className={cn(s.inputWrapper)}>
						<P2>
							{t('forgotPassword.email')}
						</P2>
						<input
							className={cn(s.input)}
							{...register("email")} />
						{errors.email && (
							<P2 className={s.errorMessage}>{errors.email.message}</P2>
						)}
					</div>
				</div>
				<WhiteSpace height={"40px"}/>
				{/*buttons*/}
				<div className={"w-full flex flex-row justify-center"}>
					<SmallPrimaryButtonNew
						isLoading={loading}
						isDisabled={loading}
						text={t('forgotPassword.sendResetLink') || ''}
					/>
					<WhiteSpace width={"20px"}/>
					<SmallPrimaryButtonNew
						isDisabled={loading}
						isWhite={true}
						border={true}
						text={
							t('forgotPassword.goBack') || ''
						}
						onClick={() => setAuthView(LOGIN_AUTH_VIEW)}
					/>
					<div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default ForgotPassword;
