/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/dashboard/dashboard.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div className="app bg-level1">
			<Dashboard />
		</div>
	</StrictMode>
);
