'use client'
import { useState } from "react";
import { WelcomeAi } from "@/auth/welcome";

export default function Home() {
	const [message, setMessage] = useState("");

	const fetchHelloWorld = async () => {
		try {
			const url = process.env.NEXT_PUBLIC_API_URL + '/hello'; // Use the environment variable
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.text(); // Assuming the response is text
			setMessage(data);
		} catch (error) {
			console.log(error)
			setMessage("Error fetching data");
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<WelcomeAi isUserLoggedIn={false} isMobile={false}/>
		</main>
	);
}
