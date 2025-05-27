/** @format */

import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1 className="text-3xl font-bold">Dashboard</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
			</div>
		</>
	);
}

export default Dashboard;
