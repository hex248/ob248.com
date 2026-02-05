import { Button } from "@/components/ui/button";

function App() {
	return (
		<div
			className={
				"min-h-screen flex flex-col items-center justify-center gap-4 text-2xl"
			}
		>
			<h1 className={"font-avara text-4xl"}>Oliver Bryan</h1>
			<Button variant={"outline"} size={"sm"} className="">
				test
			</Button>
		</div>
	);
}

export default App;

