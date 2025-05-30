/** @format */
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Constants } from "../utils/constants";

function Navigation() {
	return (
		<nav className="flex items-center justify-between mb-20">
			{/* logo */}
			<div className="logo-container ">
				<div className="logo"></div>
				<div className="logo-text">{Constants.APP_NAME}</div>
			</div>
			{/* profile */}
			<UserCircleIcon className="h-8 w-8 text-primaryText cursor-pointer" />
		</nav>
	);
}

export default Navigation;
