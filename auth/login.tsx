import React, { useState } from "react";
import useAuthLogic from "./auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "next-i18next";
import { errorToast } from "@/auth/index";
import { WhiteSpace, SmallPrimaryButtonNew } from "@/components";
import { AUTH_VIEW_FORGOT_PASSWORD } from "@/auth/welcome";
import cn from "clsx";
import s from "./Form.module.css";

const loginSchema = z.object({
	email: z.string().email().min(1, { message: 'Email is required' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login: React.FC<{ isMobile: boolean, setAuthView: React.Dispatch<any> }> = ({isMobile, setAuthView}) => {
	const {login} = useAuthLogic()
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string>()
	const errorMessage = "Error when logging in. Try again. " +
		"If the problem persists, please contact info@dogsup.co";

	const onSubmit = async (data: any) => {
		try {
			setSubmitError("");
			setLoading(true); // Set loading to true when starting the login process
			await login(data.email, data.password);
		} catch (e: any) {
			console.log(e)
			errorToast(errorMessage);
		} finally {
			setLoading(false); // Set loading to false when the login process is complete
		}
	};

	const {
		register,
		handleSubmit,
		formState: {errors}
	} = useForm<LoginSchema>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const {t} = useTranslation()

	const SIGNUP_HERE_TEXT = t('login.signup')
	const LOGIN_TEXT = t('login.login')
	const DONT_YOU_HAVE_AN_ACCOUNT_TEXT = t('login.dont_you_have_an_account')
	const FORGOT_PASSWORD_TEXT = t('login.forgot_password')
	const PASSWORD_TEXT = t('login.password')
	const EMAIL_TEXT = t('login.email');

	return (
		<div className={cn(s.formWrapper)}>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			{!isMobile ?
				<h1 className="adieu-font">{LOGIN_TEXT}</h1>
				:
				<h2 className="adieu-font">{LOGIN_TEXT}</h2>
			}
			<WhiteSpace height={"15px"}/>
			<p className="josefin-font" style={{fontWeight: 600}}>{DONT_YOU_HAVE_AN_ACCOUNT_TEXT} <span className={cn(s.callToAction)} onClick={() => {
				setAuthView(AUTH_VIEW_FORGOT_PASSWORD)
			}}>{SIGNUP_HERE_TEXT}</span></p>

			<form className={cn(s.form)}>
				<div className={cn(s.formSection)}>
					<div className={cn(s.inputWrapper)}>
						<p className="josefin-font">{EMAIL_TEXT}</p>
						<input className={cn(s.input)} {...register("email")} />
						{errors.email && <p>{errors.email.message}</p>}
					</div>
				</div>

				<div className={cn(s.formSection)}>
					<div className={cn(s.inputWrapper)}>
						<p className="josefin-font">{PASSWORD_TEXT}</p>
						<input type={"password"} className={cn(s.input)} {...register("password")} />
						{errors.password && <p>{errors.password.message}</p>}
					</div>
				</div>
				<WhiteSpace height={"20px"}/>
				<div className="w-full flex flex-row justify-end">
					<p className="josefin-font" style={{fontWeight: 600}}><span className={cn(s.callToAction)}
																				onClick={() => {
																					setAuthView(AUTH_VIEW_FORGOT_PASSWORD)
																				}}>{FORGOT_PASSWORD_TEXT}</span></p>
				</div>
				<WhiteSpace height={"20px"}/>
				<SmallPrimaryButtonNew
					isMobile={isMobile}
					isLoading={loading}
					text={LOGIN_TEXT}
					onClick={handleSubmit(onSubmit)}
				/>
			</form>
		</div>
	)
}

export default Login;
