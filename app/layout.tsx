// layout.tsx
"use server";

import { headers } from "next/headers";
import { userAgent } from "next/server";
import LayoutClient from "./layoutClient";

export default async function Layout({children}: { children: React.ReactNode }) {
	const reqUserAgent = userAgent({headers: headers()});
	return <LayoutClient reqUserAgent={reqUserAgent}>{children}</LayoutClient>
}
