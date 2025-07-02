import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";

function App() {
	const [isLogged, setIsLogged] = React.useState(false);

	React.useEffect(() => {
		if (localStorage.getItem("token")) {
			setIsLogged(true);
		}
	}, []);

	return (
		<GoogleOAuthProvider clientId="643104223014-rn30aeo7our2dt7gdra9sc5rvoirs9if.apps.googleusercontent.com">
			<div className="h-screen w-full flex items-center justify-center">
				<Login setIsLogged={setIsLogged} isLogged={isLogged} />
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
