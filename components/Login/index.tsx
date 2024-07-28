"use client";

import { z } from "zod";
import cn from "clsx";
import s from "./Form.module.css";
import { P2 } from "@/components/texts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButtonNew, SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import React, { useState } from "react";
import useAuthLogic from "@/components/auth/auth";
import LoadingDots from "@/components/LoadingDots";

const loginSchema = z.object({
	email: z.string().email().min(1, {message: 'Email är obligatoriskt'}),
	password: z.string().min(6, {message: 'Lösenordet måste vara minst 6 tecken'}),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const {login} = useAuthLogic();
	const [errorState, setErrorState] = useState("")

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<LoginSchema>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: any) => {
		try {
			setLoading(true); // Set loading to true when starting the login process
			await login(data.email, data.password);
		} catch (e: any) {
			setErrorState(Object.entries(e).toString())
		} finally {
			setLoading(false); // Set loading to false when the login process is complete
		}
	};

	return (
		<div className={cn(s.formWrapper, "bg-white rounded-[8px] lg:px-[80px]")}>
			<WhiteSpace height={"44px"}/>
			<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
				<path
					d="M40 0C17.9065 0 0 17.9065 0 40C0 62.0935 17.9065 80 40 80C62.0935 80 80 62.0935 80 40C80 17.9065 62.103 0 40 0ZM65.0558 54.1752C64.3912 55.7512 63.4227 57.2134 62.2549 58.4667C61.4954 59.3212 60.6409 60.1092 59.7294 60.8213C57.9065 62.2454 55.8367 63.3658 53.7194 64.1158C52.0199 64.7235 50.254 65.1887 48.507 65.502C46.76 65.8153 45.0225 65.9862 43.3705 66.0147C42.0508 66.0147 40.826 65.9103 39.6677 65.7584C27.6952 64.1823 23.3753 56.0551 14.6309 59.3306C14.1467 59.511 13.7194 58.9414 14.0423 58.5236C16.2165 55.7512 19.0553 54.2796 22.4068 54.9347C22.5682 54.9632 22.6917 54.7828 22.5872 54.6499C21.4954 53.1498 21.1915 51.0135 21.3435 48.5925C21.4099 47.3392 21.6188 46.1619 21.8372 44.8801C23.4512 37.9967 26.8787 32.3095 27.7427 25.4356V25.4166C27.8471 23.812 27.5243 22.2075 26.3565 21.0301L26.3375 21.0112C25.7014 20.489 24.9608 20.6978 24.4291 21.1156C24.4291 21.1156 24.4102 21.1251 24.4007 21.1346C22.6917 22.9575 21.6093 25.6349 18.8274 26.0622C16.7861 26.385 15.3905 24.4481 15.1721 22.6252C14.9537 19.9383 16.3494 17.4697 18.6091 15.9601C21.8277 13.9188 25.9103 13.1688 29.1384 14.9917C30.9138 15.9791 32.2431 17.1754 33.2115 18.5331C34.1799 19.8908 34.7971 21.4099 35.1389 23.024C35.8035 26.4799 35.4807 30.0309 34.6641 33.5153C34.2749 35.3192 33.8001 37.1137 33.3159 38.8322C32.8317 40.5507 32.338 42.2122 31.9202 43.7408V43.7693C31.7304 45.1365 31.6924 46.4847 31.9013 47.8139C32.1006 49.1526 32.5469 50.4723 33.3349 51.7731C34.5502 53.7669 36.4396 55.1531 38.5474 55.7797C40.6551 56.4064 42.9718 56.2639 45.051 55.2006C46.4752 54.4695 47.624 53.4536 48.545 52.2668C49.2001 51.3268 49.7413 50.3204 50.1685 49.2571C51.3174 46.3328 51.6686 43.0192 51.1654 39.8576C51.1465 39.7342 51.0135 39.6677 50.9091 39.7247C49.0672 40.5887 46.5132 40.1139 46.1239 37.9872C45.4783 34.9774 49.0292 32.5089 51.8016 33.4678C52.5516 33.7337 53.1213 34.3128 53.3302 35.1294C53.8524 36.8099 52.8839 38.4239 51.4883 39.3829C51.3933 39.4493 51.3838 39.5822 51.4598 39.6677C54.5265 42.8293 53.7574 47.2063 53.4251 48.545C53.3871 48.6969 53.5485 48.8298 53.691 48.7539C57.3368 46.741 59.5585 42.6869 59.8718 38.6423C59.9763 36.1737 59.549 33.4868 57.935 31.4455C55.5709 28.6542 52.0294 28.0085 48.9153 26.6129C47.738 26.0717 46.4467 24.8944 46.874 23.3943C47.3582 21.3719 49.6843 21.7707 51.4693 22.1885C51.6497 22.2264 51.7731 22.0081 51.6402 21.8846C48.526 18.742 44.4054 16.1975 40.2279 14.9917C40.019 14.9347 40.0665 14.6214 40.2848 14.6309C50.1875 15.2196 59.4446 21.7707 63.3088 31.0278C66.2711 38.1771 66.0242 46.4942 62.6537 53.4251C62.5587 53.615 62.8056 53.7859 62.948 53.634C63.1474 53.4251 63.3658 53.1783 63.6031 52.9029C64.4386 52.0389 65.1982 51.1465 65.7109 50.159C65.8058 49.9786 66.0717 50.0546 66.0527 50.254C65.9293 51.6022 65.578 52.9219 65.0463 54.1752H65.0558Z"
					fill="#121124"/>
			</svg>
			<WhiteSpace height={"20px"}/>
			<h1 className={"text-[40px]"}>Logga in</h1>
			<WhiteSpace height={"60px"}/>
			<form className={cn(s.form)} onSubmit={handleSubmit(onSubmit)}>
				{/*EMAIL*/}
				<div className={cn(s.inputWrapper)}>
					<input placeholder={"Email"} className={cn(s.input)} {...register("email")} />
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<WhiteSpace height={"30px"}/>
				{/*PASSWORD*/}
				<div>
					<input
						type="password"
						placeholder={"Lösenord"}
						className={cn(s.input)}
						{...register("password")}
					/>
					{errors.password && <p>{errors.password.message}</p>}
					{errorState && errorState.toString()}
				</div>
				<WhiteSpace height={"26px"}/>
				<button
					className="bg-[#100F1F] flex justify-center items-center text-[#FCFBF9] h-[52px] rounded-[8px] hover:text-[#100F1F] w-[273px] hover:bg-[#FA85C4]">
					<p className={"text-[16px]"}>
						{loading ? <LoadingDots /> : "LOGGA IN"} </p>
				</button>
				<WhiteSpace height={"44px"}/>
			</form>
		</div>
	);
};
