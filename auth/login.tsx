import React, { useState } from "react";
import useAuthLogic from "./auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "next-i18next";
import { errorToast } from "@/auth/index";
import { WhiteSpace, SmallPrimaryButtonNew } from "@/components";

const loginSchema = z.object({
	email: z.string().email().min(1, { message: 'Email is required' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login: React.FC<{ isMobile: boolean, setAuthView: React.Dispatch<any> }> = ({ isMobile, setAuthView }) => {
	const { login } = useAuthLogic();
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string>();
	const errorMessage = "Error when logging in. Try again. If the problem persists, please contact info@dogsup.co.";

	const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	});

	const { t } = useTranslation();
	const onSubmit = async (data: LoginSchema) => {
		try {
			setLoading(true);
			await login(data.email, data.password);
		} catch (e) {
			console.error(e);
			errorToast(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4 bg-white shadow-md rounded-lg">
			<Toaster position="top-center" reverseOrder={false} />
			<div className="text-lg font-bold text-center">{t('login.login')}</div>
			<WhiteSpace height="15px" />
			<div className="text-sm font-semibold">
				{t('login.dont_you_have_an_account')}
				<span className="cursor-pointer text-blue-500" onClick={() => setAuthView('signup')}>
          {t('login.signup')}
        </span>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('login.email')}</label>
					<input
						id="email"
						type="email"
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						{...register("email")}
					/>
					{errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
					<input
						id="password"
						type="password"
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						{...register("password")}
					/>
					{errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
				</div>
				<WhiteSpace height="20px" />
				<div className="flex justify-end">
          <span className="text-sm font-semibold cursor-pointer text-blue-500" onClick={() => setAuthView('forgot_password')}>
            {t('login.forgot_password')}
          </span>
				</div>
				<WhiteSpace height="20px" />
				<SmallPrimaryButtonNew
					isLoading={loading}
					text={t('login.login')}
					onClick={() => {}}
					border
					isDisabled={loading}
					isMobile={isMobile}
					isWhite={false}
				/>
			</form>
		</div>
	);
}

export default Login;
