/** @format */

export type CARD_TYPE = "EMPTY" | "CREATE" | "DOCUMENT";
export type DOC_CARD = {
	id: string; // Unique identifier for the document
	docName: string; // Title of the document
	updatedAt: string; // Last updated timestamp
	docType: string; // Type of the document (e.g., text, code, etc.)
	docSize: number; // Size of the document in bytes
	docUrl: string; // URL to access the document
	docThumbnail: string; // URL to the document's thumbnail image
	docAuthor: string; // Author of the document
	docAuthorId: string; // Unique identifier for the author
	docAuthorAvatar: string; // URL to the author's avatar image
	docAuthorEmail: string; // Email of the document's author
	docAuthorUsername: string; // Username of the document's author
	docAuthorBio: string; // Bio of the document's author
	docAuthorCreatedAt: string; // Timestamp when the author was created
	docAuthorUpdatedAt: string; // Timestamp when the author was last updated
	docAuthorFollowers: number; // Number of followers the author has
};
