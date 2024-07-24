import { app } from "./components/auth/firebase";
import { getAuth } from "firebase/auth";

export function middleware(request) {
	const auth = getAuth(app);
	console.log(auth.currentUser)
	
}

// applies this middleware only to files in the app directory
export const config = {
	matcher: '/((?!api|static|.*\\..*|_next).*)'
};
