'use client'
import { useState } from "react";

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
			<h1>Dog talk, luna.ai or smth else..</h1>
			{/* Button to fetch data from backend */}
			<button className="mt-5 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
					onClick={fetchHelloWorld}>
				Talk to Backend
			</button>
			{/* Display message from the backend */}
			<p className="mt-5 text-lg">{message}</p>
		</main>
	);
}
