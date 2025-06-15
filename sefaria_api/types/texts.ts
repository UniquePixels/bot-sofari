// Add these types to your existing file

import type { ApiWarning } from './api.ts';

export type VersionStatus = 'locked' | '';
export type Language =
	| 'he'
	| 'en'
	| 'fr'
	| 'pl'
	| 'it'
	| 'fa'
	| 'yi'
	| 'es'
	| 'eo'
	| 'de'
	| 'ru'
	| 'pt';
export type LanguageFamily =
	| 'hebrew'
	| 'english'
	| 'french'
	| 'polish'
	| 'italian'
	| 'persian'
	| 'yiddish'
	| 'spanish'
	| 'esperanto'
	| 'german'
	| 'russian'
	| 'portuguese';
export type TextDirection = 'rtl' | 'ltr';
export type License =
	| 'CC-BY-SA'
	| 'CC-BY-NC'
	| 'CC-BY'
	| 'Public Domain'
	| 'CC0'
	| 'PD'
	| '';
export type AddressType =
	| 'Perek'
	| 'Pasuk'
	| 'Chapter'
	| 'Verse'
	| 'Daf'
	| 'Line'
	| 'Section';

export interface Version {
	status: VersionStatus;
	priority: number | '';
	license: License;
	versionNotes: string;
	formatAsPoetry: string;
	digitizedBySefaria: boolean | '';
	method: string;
	heversionSource: string;
	versionUrl: string;
	versionTitleInHebrew: string;
	versionNotesInHebrew: string;
	shortVersionTitle: string;
	shortVersionTitleInHebrew: string;
	extendedNotes: string;
	extendedNotesHebrew: string;
	purchaseInformationImage: string;
	purchaseInformationURL: string;
	hasManuallyWrappedRefs: string | boolean;
	language: Language;
	versionSource: string;
	versionTitle: string;
	actualLanguage: Language;
	languageFamilyName: LanguageFamily;
	isSource: boolean;
	isPrimary: boolean;
	direction: TextDirection;
	text?: string | string[]; // Only present in versions array, not available_versions
	title?: string; // Only present in available_versions
	sources?: string[]; // Present when fill_in_missing_segments is used
}

export interface TextsResponse {
	versions: Version[];
	// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
	available_versions: Version[];
	ref: string;
	heRef: string;
	sections: string[];
	toSections: string[];
	sectionRef: string;
	heSectionRef: string;
	firstAvailableSectionRef: string;
	isSpanning: boolean;
	next: string | null;
	prev: string | null;
	title: string;
	book: string;
	heTitle: string;
	// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
	primary_category: string;
	type: string;
	indexTitle: string;
	categories: string[];
	heIndexTitle: string;
	isComplex: boolean;
	isDependant: boolean;
	order: number[];
	collectiveTitle: string;
	heCollectiveTitle: string;
	alts: unknown[]; // Could be more specific if you have examples
	lengths: number[];
	length: number;
	textDepth: number;
	sectionNames: string[];
	addressTypes: AddressType[];
	titleVariants: string[];
	heTitleVariants: string[];
	// biome-ignore lint/style/useNamingConvention: <explanation>
	index_offsets_by_depth: Record<string, unknown>;
	warnings: Record<string, ApiWarning>[];
	error?: string; // For error responses
}
