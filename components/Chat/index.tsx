import React, { useState, useEffect, useRef } from "react";
import { Dog, useAuth } from "@/components/auth/auth";
import { useDropzone } from "react-dropzone";

const chat = async (message: string, file: File | null, idToken: string, onData: (data: string, chunkCounter: number) => void) => {
	try {
		const formData = new FormData();
		formData.append('input', message);
		if (file) {
			formData.append('file', file);
		}

		const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat", {
			method: 'POST',
			headers: {
				"Authorization": `Bearer ${idToken}`,
			},
			body: formData,
		});

		if (!response.body) {
			throw new Error('No response body');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder('utf-8');
		let done = false;

		let chunkCounter = 0;
		while (!done) {
			const {value, done: readerDone} = await reader.read();
			done = readerDone;
			const chunkValue = decoder.decode(value, {stream: true});
			onData(chunkValue, chunkCounter);
			chunkCounter++;
		}
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
};

const Chat: React.FC<{ isMobile: boolean, dog: Dog }> = () => {
	const [message, setMessage] = useState<string>("");
	const {idToken} = useAuth();
	const [chatLog, setChatLog] = useState<{ message: string, isUser: boolean }[]>([
		{
			message: "Hi I am your personalized behavior dog coach. I have been trained on the most relevant dog behavior research. Ask me any question about your dog and I will use all relevant information of your dog and find the best research and how it can help you",
			isUser: false
		}
	]);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatLog]);

	const handleSend = async () => {
		setChatLog(prevChatLog => [...prevChatLog, {message, isUser: true}]);
		let botMessage = "";

		try {
			await chat(message, file, idToken!, (data, chunkCounter) => {
				botMessage += data;
				setChatLog(prevChatLog => {
					const updatedLog = [...prevChatLog];
					if (chunkCounter === 0) {
						updatedLog.push({message: botMessage, isUser: false});
					} else {
						updatedLog[updatedLog.length - 1] = {message: botMessage, isUser: false};
					}
					return updatedLog;
				});
			});
		} catch (error) {
			console.error('API Request Error:', error);
		}

		setMessage("");  // Clear input field after sending the message
	};

	const [file, setFile] = useState<File | null>(null);

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			setFile(acceptedFiles[0]);
		}
	};

	const {getRootProps, getInputProps} = useDropzone({onDrop, accept: 'image/*'});

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-gray-100">
			<div className="bg-white w-full p-6 rounded-md shadow-md">
				<div
					ref={chatContainerRef}
					className="w-full h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-white mb-4"
				>
					{chatLog.map((log, index) => (
						<div
							key={index}
							className={`mb-2 p-3 rounded-md ${
								log.isUser ? 'bg-blue-100 text-left' : 'bg-gray-100 text-left'
							}`}
						>
							{log.message}
						</div>
					))}
				</div>
				<div className="flex flex-col">
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type your message here"
						className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
					/>
					<div {...getRootProps()}
						 className="w-full p-2 border border-gray-300 rounded-md text-center cursor-pointer mb-2">
						<input {...getInputProps()} />
						{file ? file.name : 'Drag and drop a file here, or click to select a file'}
					</div>
					<button
						onClick={handleSend}
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
