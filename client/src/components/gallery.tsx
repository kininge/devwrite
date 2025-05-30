/** @format */

import { CARD_TYPES, Constants } from "../utils/constants";
import { formatDate } from "../utils/functions";
import type { DOC_CARD, CARD_TYPE } from "../utils/models";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

function Gallery() {
	const [documents, setDocuments] = useState<DOC_CARD[]>([]);

	useEffect(() => {}, []);

	const renderDocCard = (cardType: CARD_TYPE, doc?: DOC_CARD) => {
		if (cardType === CARD_TYPES.EMPTY) {
			return <div className="doc-card empty-doc-card"></div>;
		} else if (cardType === CARD_TYPES.CREATE) {
			return (
				<div className="doc-card flex items-center justify-center cursor-pointer">
					<PlusIcon className="h-16 w-16 text-primaryText cursor-pointer" />
				</div>
			);
		} else {
			return (
				<div className="doc-card cursor-pointer relative shadow-md rounded-24px overflow-hidden">
					{/* doc image */}
					<img
						src={doc?.docThumbnail}
						alt={doc?.docName}
						className="w-full object-scale-down absolute top-0 left-0 rounded-tl-24px rounded-tr-24px"
					/>

					{/* doc details */}
					<div className="w-full p-4 absolute bottom-0 left-0 bg-level1">
						<h3 className="text-lg font-sans text-primaryText font-semibold">
							{doc?.docName}
						</h3>
						<p className="text-[12px] font-sans text-secondaryText">
							{formatDate(doc?.updatedAt ?? "")}
						</p>
					</div>
				</div>
			);
		}
	};

	const renderNoDocuments = () => {
		return (
			<div className="no-documents">
				<h2 className="text-2xl font-sans font-bold text-primaryText">
					{Constants.NO_DOCUMENTS_TITLE}
				</h2>
				<p className="text-sm font-sans text-secondaryText">
					{Constants.NO_DOCUMENTS_SUBTITLE}
				</p>
			</div>
		);
	};

	return (
		<div className="gallery">
			{/* initial empty space */}
			{renderDocCard(CARD_TYPES.EMPTY)}
			{/* create document card */}
			{renderDocCard(CARD_TYPES.CREATE)}
			{/* document cards */}
			{documents.length > 0 &&
				documents.map((doc) => renderDocCard(CARD_TYPES.DOCUMENT, doc))}
			{documents.length === 0 && renderNoDocuments()}
		</div>
	);
}
export default Gallery;
