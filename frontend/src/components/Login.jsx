import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = ({ setIsLogged, isLogged }) => {
	const [data, setData] = React.useState(null);

	const fetchData = async () => {
		const response = await axios.get("/api/getUser", {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});

		setData(response.data);
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	const handleSuccess = async (credentialResponse) => {
		const idToken = credentialResponse.credential;

		try {
			const res = await axios.post("/api/authGoogle", {
				token: idToken,
			});
			const jwtToken = res.data.token;
			localStorage.setItem("token", jwtToken);
			console.log("Logged in! JWT:", jwtToken);
			setIsLogged(true);
			fetchData();
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleError = () => {
		console.log("Login Failed");
	};

	return (
		<div>
			{!isLogged ? (
				<div className="flex flex-col items-center justify-evenly bg-zinc-200 w-[300px] h-[200px] rounded">
					<h1 className="font-semibold bg-rose-300 px-10 py-1.5 rounded">
						Login
					</h1>
					<GoogleLogin
						type="standard"
						onSuccess={handleSuccess}
						onError={handleError}
						theme="filled_black"
					/>
				</div>
			) : (
				<div>
					{data ? (
						<div>
							<div>
								<button
									onClick={() => {
										localStorage.removeItem("token");
										setIsLogged(false);
									}}
									className="bg-red-500 mb-2 text-white px-3 py-1 font-semibold rounded"
								>
									Logout
								</button>
							</div>

							<div className="h-[300px] w-[300px] p-5 bg-emerald-100 flex items-center gap-2 justify-center flex-col">
								<img
									className="w-18 rounded-full object-cover"
									src={data.picture}
									alt={data.name}
								/>
								<h1 className="bg-emerald-600 text-white font-semibold px-3 rounded">
									{data.name}
								</h1>
								<p className="bg-emerald-600 text-white px-3 rounded">
									{data.email}
								</p>
							</div>
						</div>
					) : (
						<p>Loading...</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Login;
