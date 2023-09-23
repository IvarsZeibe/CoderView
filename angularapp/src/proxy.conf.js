const PROXY_CONFIG = [
	{
		context: ["/weatherforecast"],
		target: "https://localhost:7051",
		secure: false,
	},
	{
		context: ["/api/signin"],
		target: "https://localhost:7051",
		secure: false,
	},
	{
		context: ["/api/signup"],
		target: "https://localhost:7051",
		secure: false,
	},
	{
		context: ["/api/signout"],
		target: "https://localhost:7051",
		secure: false,
	},
	{
		context: ["/api/profile"],
		target: "https://localhost:7051",
		secure: false,
	},
];

module.exports = PROXY_CONFIG;
