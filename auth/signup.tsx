import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./Form.module.css";
import { SmallPrimaryButtonNew, WhiteSpace } from "../components";
import { errorToast } from "../auth";
import cn from "clsx";
import { LOGIN_AUTH_VIEW } from "@/auth/welcome";

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

const SignUp: React.FC<{ isMobile: boolean; setAuthView: React.Dispatch<any>, origin: string }> = ({
																									   isMobile,
																									   setAuthView
																								   }) => {
	const {t} = useTranslation();
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<SignupSchema>({
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(signupSchema)
	})

	const [signUpView, setSignUpView] = useState("SIGNUP_VIEW");

	const errorMessage = "Error when signing up. Try again!" +
		" If the problem persists, please contact info@dogsup.co";

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");

	const handleFormSubmit = async (data: { email: string; }) => {
		try {
			setLoading(true);
			await handleSignUp(data.email, origin);
			setEmail(data.email);
			setSignUpView("VERIFY_EMAIL_VIEW");
		} catch (e: any) {
			console.error(e);
			errorToast(errorMessage);
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
					{!isMobile ? <h2 style={{fontFamily: "Adieu"}}>
						{t('signup.title')}
					</h2> : <h3 style={{fontFamily: "Adieu"}}>
						{t('signup.title')}
					</h3>}
					<WhiteSpace height={'15px'}/>
					<p style={{fontWeight: 600}}>
						{t('signup.alreadyHaveAnAccount')} &nbsp;
						<span className={cn(s.callToAction)} onClick={() => setAuthView(LOGIN_AUTH_VIEW)}>
              {t('signup.loginHere')}
            </span>
					</p>
					<form className={cn(s.form)} onSubmit={handleSubmit(handleFormSubmit)}>
						{/* EMAIL */}
						<div className={cn(s.formSection)}>
							<div className={cn(s.inputWrapper)}>
								<p>
									{t('signup.email')}
								</p>
								<input className={cn(s.input)} {...register('email')} />
								{errors.email && (
									<p className={s.errorMessage}>{errors.email.message}</p>
								)}
							</div>
						</div>
						<WhiteSpace height={'40px'}/>
						<SmallPrimaryButtonNew
							isMobile={isMobile}
							isLoading={loading}
							text={t('signup.letsGo') || ''}
						/>
					</form>
				</>
			)}
			{signUpView === "VERIFY_EMAIL_VIEW" && (
				<VerifyEmail email={email} isMobile={isMobile} setAuthView={setAuthView}/>
			)}
		</div>
	);
};



const VerifyEmail: React.FC<{ email: string, isMobile: boolean; setAuthView: React.Dispatch<any> }> = ({
																										   email,
																										   isMobile,
																										   setAuthView
																									   }) => {
	const titleFontSize = isMobile ? 32 : 34;
	const breadTextFontSize = isMobile ? 16 : 18;
	const emailFontSize = 22;
	const titleSpace = isMobile ? 37 : 50;
	const {t} = useTranslation()
	return (
		<div className={cn(s.formWrapper)}>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<p style={{ fontSize: titleFontSize + "px", fontFamily: "Adieu" }}>
				{t('verifyYourEmail.title')}
			</p>
			<WhiteSpace height={titleSpace + "px"}/>
			<p style={{ fontWeight: 600, lineHeight: "150%", textAlign: "center", fontSize: breadTextFontSize + "px" }}>
				<div className={"flex lg:flex-row flex-col"}>
          <span>
            {t('verifyYourEmail.thankYouForSigning')}
          </span>
					<span>&nbsp;
						{t('verifyYourEmail.youAreAlmostThere')}
          </span>
				</div>
			</p>
			<WhiteSpace height={breadTextFontSize + "px"}/>
			<p style={{ fontWeight: 600, lineHeight: "150%", textAlign: "center", fontSize: breadTextFontSize + "px" }}>
				{t('verifyYourEmail.weSentAnEmail')}
			</p>
			<p style={{ fontWeight: 700, lineHeight: "150%", textAlign: "center", fontSize: emailFontSize + "px" }}>{email}</p>
			<WhiteSpace height={breadTextFontSize + "px"}/>
			<p style={{ fontWeight: 600, lineHeight: "150%", textAlign: "center", fontSize: breadTextFontSize + "px" }}>
				{t('verifyYourEmail.pleaseVerify')}
				&nbsp;
				<span className={"font-bold"}>
          {t('verifyYourEmail.checkYourSpam')}
        </span>
			</p>
			<WhiteSpace height={breadTextFontSize + "px"}/>
			<p style={{ fontWeight: 600, lineHeight: "150%", textAlign: "center", fontSize: breadTextFontSize + "px" }}>
				{t('verifyYourEmail.stillCantFind')}
			</p>
			<WhiteSpace height={titleSpace + "px"}/>
			<SmallPrimaryButtonNew
				isMobile={isMobile}
				text={t('verifyYourEmail.resendVerificationEmail') || ''}
			/>
		</div>
	);
}


export default SignUp;
