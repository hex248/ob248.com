import { ThemeToggle } from "@/components/theme-toggle";

function App() {
	return (
		<div
			className={
				"min-h-screen flex flex-col items-center justify-center gap-4 text-2xl"
			}
		>
			<h1 className={"picnic text-8xl"}>Oliver Bryan</h1>
			<ThemeToggle />
		</div>
	);
}

export default App;
