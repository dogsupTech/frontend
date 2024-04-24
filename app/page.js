"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function Home() {
    const [message, setMessage] = (0, react_1.useState)("");
    const fetchHelloWorld = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const url = process.env.NEXT_PUBLIC_API_URL + '/hello'; // Use the environment variable
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = yield response.text(); // Assuming the response is text
            setMessage(data);
        }
        catch (error) {
            console.log(error);
            setMessage("Error fetching data");
        }
    });
    return (<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1>Dog talk, luna.ai or smth else..</h1>
			{/* Button to fetch data from backend */}
			<button className="mt-5 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700" onClick={fetchHelloWorld}>
				Talk to Backend
			</button>
			{/* Display message from the backend */}
			<p className="mt-5 text-lg">{message}</p>
		</main>);
}
exports.default = Home;
