'use client'

import { useParams } from 'next/navigation';
import { useState } from "react";

export default function ConsultationPage() {
	const params = useParams();
	const [consultation, setConsultation] = useState(null);

	// useEffect(() => {
	// 	const fetchConsultation = async () => {
	// 		// Replace with your actual API endpoint
	// 		const response = await fetch(`/api/consultation/${params.id}`);
	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			setConsultation(data);
	// 		}
	// 	};
	//
	// 	fetchConsultation();
	// }, [params.id]);

	// if (!consultation) {
	// 	return <div>Loading...</div>;
	// }
	
	console.log(params)

	return (
		<div>
			<h1>Consultation: {consultation}</h1>

			{params.id}

			{/* Display other consultation details here */}
		</div>
	);
}
