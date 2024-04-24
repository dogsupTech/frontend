'use client'
import { useState } from "react";
import { WelcomeAi } from "@/auth/welcome";

export default function Home() {
	const [message, setMessage] = useState("");
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<WelcomeAi isUserLoggedIn={false} isMobile={true}/>
		</main>
	);
}
