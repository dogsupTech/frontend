// useIsMobile.ts
import { useContext } from "react";
import { UserAgentContext } from "./userAgentContext";

export const useIsMobile = () => {
	const userAgent = useContext(UserAgentContext);
	if (!userAgent) {
		throw new Error("useIsMobile must be used within a UserAgentContext.Provider");
	}

	return userAgent.device.type === "mobile";
};
