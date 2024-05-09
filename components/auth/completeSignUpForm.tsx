// Type-safe properties for the SignUp component
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import s from "./Form.module.css";
import { errorToast, successToast } from "@/components/auth/index";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import { CustomAdieu, P2 } from "@/components/texts";
import cn from "clsx";
import { YouAreOnTheWaitList } from "@/components/auth/youAreOnTheWaitlist";
import { completeSignupSchema, CompleteSignUpSchemaType, useAuthLogic } from "@/components/auth/auth";
import { useRouter } from "next/navigation";

interface SignUpProps {
	isMobile: boolean;
	token: string;
	email: string;
	redirectUrl: string;
	origin: string;
}

const SignUpPOST = async (data: CompleteSignUpSchemaType, token: string, origin: string) => {
	const response = await fetch(process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_URL + "/complete-signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			data: data,
			token: token,
			origin: process.env.NEXT_PUBLIC_ORIGIN,
		}),
	});
	if (!response.ok) {
		console.log("response:", response)
		throw new Error(JSON.stringify(response));
	}
}

export const CompleteSignUpForm: React.FC<{
	isMobile: boolean,
	token: string,
	email: string,
	redirectUrl: string,
	origin: string
}> = ({
		  isMobile,
		  token,
		  email,
		  redirectUrl,
		  origin
	  }) => {


	const {t} = useTranslation();
	console.log("email", email)
	console.log("redirectUrl", redirectUrl)
	console.log("origin", origin)
	const [signUpView, setSignUpView] = useState("SIGNUP_VIEW");

	const {
		register,
		handleSubmit,
		formState: {errors} // Destructuring errors from formState
	} = useForm<CompleteSignUpSchemaType>({
		defaultValues: {
			email: email,
			password: "",
			firstName: "",
			lastName: "",
			phoneNumber: ""
		},
		resolver: zodResolver(completeSignupSchema)
	});
	const router = useRouter();
	const [loading, setLoading] = useState(false); // State variable for loading state
	const {login} = useAuthLogic()

	const titleFontSize = isMobile ? 32 : 34;
	const titleLetterSpacing = isMobile ? "-0.68px" : "-0.68px";
	const handleFormSubmit = async (data: CompleteSignUpSchemaType) => {
		try {
			setLoading(true);
			await SignUpPOST(data, token, origin);
			successToast("Signup successful!");
			setSignUpView("VERIFY_EMAIL_VIEW")
			await login(email, data.password);
			setLoading(false);
		} catch (e: any) {
			setLoading(false);
			console.error('Error completing signup:', e);
			errorToast("An error occurred while signing up, please try again");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className={cn(s.formWrapper)}>
			{signUpView === "SIGNUP_VIEW" && (
				<>
					<Toaster
						position="top-center"
						reverseOrder={false}
					/>
					<WhiteSpace height={"60px"}/>
					<CustomAdieu letterSpacing={titleLetterSpacing} textAlign={"center"} lineHeight={"105%"}
								 fontWeight={900}
								 fontSize={titleFontSize + "px"}>
						{t('completeSignup.title')} </CustomAdieu>
					<WhiteSpace height={"30px"}/>
					<form className={cn(s.form)} onSubmit={handleSubmit(handleFormSubmit)}>
						{/*EMAIL*/}
						<div className={cn(s.formSection)}>
							<div className={cn(s.inputWrapper)}>
								<P2>{t('completeSignup.email')}</P2>
								<input
									disabled={true}
									className={cn(s.input)}
									{...register("email")} />
								{errors.email && (
									<P2 className={s.errorMessage}>{errors.email.message}</P2>
								)}
							</div>
						</div>
						{/*PASSWORD*/}
						<div className={cn(s.formSection)}>
							<div className={cn(s.inputWrapper)}>
								<P2>
									{t('completeSignup.password')}
								</P2>
								<input
									type={"password"}
									className={cn(s.input)}
									{...register("password")} />
								{errors.password && (
									<P2 className={s.errorMessage}>{errors.password.message}</P2>
								)}
							</div>
						</div>
						{/*FIRST NAME AND LAST NAME*/}
						<div className={cn(s.formSection)}>
							<div className={cn(s.inputWrapper)}>
								<P2>
									{t('completeSignup.firstName')}
								</P2>
								<input className={cn(s.input)} {...register("firstName")} />
								{errors.firstName && (
									<P2 className={s.errorMessage}>{errors.firstName.message}</P2>
								)}
							</div>
							<WhiteSpace width={"20px"}/>
							<div className={cn(s.inputWrapper)}>
								<P2>
									{t('completeSignup.lastName')}
								</P2>
								<input className={cn(s.input)} {...register("lastName")} />
								{errors.lastName && (
									<P2 className={s.errorMessage}>{errors.lastName.message}</P2>
								)}
							</div>
						</div>
						{/*PHONE NUMBER*/}
						<div className={cn(s.formSection)}>
							<div className={cn(s.inputWrapper)}>
								<P2>
									{t('completeSignup.phoneNumber')}
								</P2>
								<input
									className={cn(s.input)}
									{...register("phoneNumber")}
								/>
								{errors.phoneNumber && (
									<P2 className={s.errorMessage}>{errors.phoneNumber.message}</P2>
								)}
							</div>
						</div>
						<WhiteSpace height={"40px"}/>
						{/*SUBMIT*/}
						<SmallPrimaryButtonNew
							isLoading={loading}
							text={"LET'S GO"}
							isDisabled={loading}
						/>
					</form>
				</>
			)}
			{signUpView === "VERIFY_EMAIL_VIEW" && (
				<YouAreOnTheWaitList email={email} isMobile={isMobile} origin={origin}/>
			)}
		</div>
	)
}




