"use client";

import { z } from "zod";
import cn from "clsx";
import s from "./Form.module.css";
import { P2 } from "@/components/texts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmallPrimaryButtonNew, WhiteSpace } from "@/components";
import { useState } from "react";
import useAuthLogic from "@/components/auth/auth";

const loginSchema = z.object({
	email: z.string().email().min(1, { message: 'Email är obligatoriskt' }),
	password: z.string().min(6, { message: 'Lösenordet måste vara minst 6 tecken' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const { login } = useAuthLogic();

	const {
		register,
		handleSubmit,
		formState: { errors },
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
			alert(e.message);
		} finally {
			setLoading(false); // Set loading to false when the login process is complete
		}
	};

	return (
		<div className={cn(s.formWrapper)}>
			<form className={cn(s.form)} onSubmit={handleSubmit(onSubmit)}>
				{/*EMAIL*/}
				<div className={cn(s.formSection)}>
					<div className={cn(s.inputWrapper)}>
						<P2>Email</P2>
						
						<input className={cn(s.input)} {...register("email")} />
						{errors.email && <p>{errors.email.message}</p>}
					</div>
				</div>
				{/*PASSWORD*/}
				<div className={cn(s.formSection)}>
					<div className={cn(s.inputWrapper)}>
						<P2>Lösenord</P2>
						<input
							type="password"
							className={cn(s.input)}
							{...register("password")}
						/>
						{errors.password && <p>{errors.password.message}</p>}
					</div>
				</div>
				<SmallPrimaryButtonNew
					isLoading={loading}
					text="Logga in"
				/>
			</form>
		</div>
	);
};
