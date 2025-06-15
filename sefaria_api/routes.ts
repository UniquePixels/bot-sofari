export const Routes = {
	// Route for: https://developers.sefaria.org/reference/get-v3-texts

	texts(
		tref: string,
		params?: {
			version?: string | string[]; // Allow single string or array
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			fill_in_missing_segments?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			return_format?:
				| 'text_only'
				| 'strip_only_footnotes'
				| 'wrap_all_entities'
				| 'default';
		},
	) {
		return {
			type: 'GET',
			url: `/v3/texts/${tref}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-versions
	versions(index: string) {
		return {
			type: 'GET',
			url: `/texts/versions/${index}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-translations
	languages() {
		return {
			type: 'GET',
			url: '/texts/languages',
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-translations-lang
	translations(lang: string) {
		return {
			type: 'GET',
			url: `/texts/translations/${lang}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-manuscripts
	manuscripts(tref: string) {
		return {
			type: 'GET',
			url: `/manuscripts/${tref}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-texts-random
	random(params?: { titles?: string; categories?: string }) {
		return {
			type: 'GET',
			url: '/texts/random',
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-v2-index
	index(title: string) {
		return {
			type: 'GET',
			url: `/v2/raw/index/${title}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-index
	toc() {
		return {
			type: 'GET',
			url: '/index',
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-shape
	shape(title: string, params?: { depth?: number; dependents?: boolean }) {
		return {
			type: 'GET',
			url: `/shape/${title}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-related
	related(tref: string) {
		return {
			type: 'GET',
			url: `/related/${tref}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-links
	links(
		tref: string,
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		params?: { with_text?: 1 | 0; with_sheet_links?: 1 | 0 },
	) {
		return {
			type: 'GET',
			url: `/links/${tref}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-ref-topic-links
	refTopicLinks(tref: string) {
		return {
			type: 'GET',
			url: `/ref-topic-links/${tref}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-calendars
	calendars(params?: {
		diaspora?: 1 | 0;
		custom?: 'ashkenazi' | 'sefardi' | 'edot hamizrach';
		year?: number;
		month?: number;
		day?: number;
		timezone?: string;
	}) {
		return {
			type: 'GET',
			url: '/calendars',
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-next-read
	nextRead(parasha: Parsha) {
		return {
			type: 'GET',
			url: `/next-read/${parasha}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-words
	lexicons(
		word: string,
		params?: {
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			lookup_ref?: string;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			never_split?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			always_consonants?: 1 | 0;
		},
	) {
		return {
			type: 'GET',
			url: `/words/${word}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-words-completion
	wordCompletion(word: string, lexicon: string, params?: { limit?: number }) {
		return {
			type: 'GET',
			url: `/words/completion/${word}/${lexicon}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-v2-topics
	topics(
		topicSlug: string,
		params?: {
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			annotate_links?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			with_links?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			annotate_time_period?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			group_related?: 1 | 0;
			// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
			with_refs?: 1 | 0;
		},
	) {
		return {
			type: 'GET',
			url: `/v2/topics/${topicSlug}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-all-topics
	allTopics(params?: { limit?: number }) {
		return {
			type: 'GET',
			url: '/topics',
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-topics-graph
	// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
	topicsGraph(topicSlug: string, params?: { link_type?: LinkTypes }) {
		return {
			type: 'GET',
			url: `/topics-graph/${topicSlug}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-recommend-topics
	recommendTopics(refList: string) {
		return {
			type: 'GET',
			url: `/recommend/topics/${refList}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-random-by-topic
	randomByTopic() {
		return {
			type: 'GET',
			url: '/random-by-topic',
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-terms
	terms(name: string) {
		return {
			type: 'GET',
			url: `/terms/${name}`,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-name
	name(
		name: string,
		params?: {
			limit?: number;
			type?: 'ref' | 'Collection' | 'Topic' | 'TocCategory' | 'Term' | 'User';
		},
	) {
		return {
			type: 'GET',
			url: `/name/${name}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/post-find-refs
	findRefs(params: {
		text: { body: string; title: string | '' };
		lang: 'he' | 'en';
	}) {
		return {
			type: 'POST',
			url: '/find-refs',
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/post-search-wrapper
	search(params: {
		aggs?: string[];
		field?: string;
		query: string;
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		filter_fields?: string[];
		filters?: string[];
		size?: number;
		slop?: number;
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		sort_fields?: string[];
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		sort_method?: 'sort' | 'score';
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		sort_reverse?: boolean;
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		sort_score_missing?: number;
		// biome-ignore lint/style/useNamingConvention: Sefaria API uses snake_case
		source_proj?: boolean;
		type?: 'text' | 'sheet';
	}) {
		return {
			type: 'POST',
			url: '/search-wrapper',
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-img-gen
	img(
		tref: string,
		params?: {
			lang: 'he' | 'en';
			platform?: 'facebook' | 'twitter';
			ven?: string;
			veh?: string;
		},
	) {
		return {
			type: 'GET',
			url: `/img-gen/${tref}`,
			params,
		};
	},

	// Route for: https://developers.sefaria.org/reference/get-category
	category(categoryPath: string) {
		return {
			type: 'GET',
			url: `/category/${categoryPath}`,
		};
	},
} as const;

type Parsha =
	| 'Bereshit'
	| 'Noach'
	| 'Lech-Lecha'
	| 'Vayera'
	| 'Chayei Sara'
	| 'Toldot'
	| 'Vayetzei'
	| 'Vayishlach'
	| 'Vayeshev'
	| 'Miketz'
	| 'Vayigash'
	| 'Vayechi'
	| 'Shemot'
	| 'Vaera'
	| 'Bo'
	| 'Beshalach'
	| 'Yitro'
	| 'Mishpatim'
	| 'Terumah'
	| 'Tetzaveh'
	| 'Ki Tisa'
	| 'Vayakhel'
	| 'Pekudei'
	| 'Vayikra'
	| 'Tzav'
	| 'Shmini'
	| 'Tazria'
	| 'Metzora'
	| 'Achrei Mot'
	| 'Kedoshim'
	| 'Emor'
	| 'Behar'
	| 'Bechukotai'
	| 'Bamidbar'
	| 'Nasso'
	| 'Beha’alotcha'
	| 'Sh’lach'
	| 'Korach'
	| 'Chukat'
	| 'Balak'
	| 'Pinchas'
	| 'Matot'
	| 'Masei'
	| 'Devarim'
	| 'Vaetchanan'
	| 'Eikev'
	| 'Re’eh'
	| 'Shoftim'
	| 'Ki Teitzei'
	| 'Ki Tavo'
	| 'Nitzavim'
	| 'Vayeilech'
	| 'Ha’azinu'
	| 'Vezot Haberakhah'
	| 'Vayakhel-Pekudei'
	| 'Tazria-Metzora'
	| 'Achrei Mot-Kedoshim'
	| 'Behar-Bechukotai'
	| 'Chukat-Balak'
	| 'Matot-Masei'
	| 'Nitzavim-Vayeilech';

type LinkTypes =
	| 'child-of'
	| 'parent-of'
	| 'child-in-law-of'
	| 'parent-in-law-of'
	| 'sibling-of'
	| 'descendant-of'
	| 'ancestor-of'
	| 'taught'
	| 'learned-from'
	| 'corresponded-with'
	| 'opposed'
	| 'cousin-of'
	| 'spouse-of'
	| 'has-role'
	| 'role-of'
	| 'gender-of'
	| 'has-gender'
	| 'person-participates-in-event'
	| 'event-has-person-participant'
	| 'adjacent-to'
	| 'causes'
	| 'has-cause'
	| 'member-of'
	| 'has-member'
	| 'physically-contains'
	| 'physically-contained-in'
	| 'temporally-contains'
	| 'temporally-contained-in'
	| 'participates-in'
	| 'has-participant'
	| 'precedes'
	| 'preceded-by'
	| 'applies-halacha'
	| 'has-halacha-application'
	| 'specifically-dependent-on'
	| 'has-specific-dependence'
	| 'relationship-of'
	| 'has-relationship'
	| 'leader-of'
	| 'has-leader'
	| 'is-a'
	| 'is-category-of'
	| 'displays-under'
	| 'displays-over'
	| 'synonymous-with'
	| 'similar-to'
	| 'dissimilar-to'
	| 'related-to'
	| 'sheets-related-to'
	| 'has-sheet-related-to';
