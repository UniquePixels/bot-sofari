import type { ChatInputCommandInteraction } from 'discord.js';
import sefaria, { Routes, type TextsResponse } from '../../sefaria_api';
import { err, postMultiText, postText } from './common-functions';

// Define the function signature type
type CommandFunction = (
	interaction: ChatInputCommandInteraction,
) => Promise<void> | void;

// Define the structure type
type FunctionRegistry = {
	[group: string]: {
		[cmd: string]: CommandFunction;
	};
};

export const executeCommand = async (
	group: string,
	cmd: string,
	interaction: ChatInputCommandInteraction,
) => {
	const commandFunction = functions[group]?.[cmd];

	if (commandFunction) {
		await commandFunction(interaction);
	} else {
		await interaction.reply('Command not found');
	}
};

const functions: FunctionRegistry = {
	post: {
		source: (interaction) => {
			const reference = interaction.options.getString('reference', true);

			sefaria
				.fetchData<TextsResponse>(
					Routes.texts(reference, { return_format: 'strip_only_footnotes' }),
				)
				.then((response) => {
					response.match(
						(data) => postText(data, interaction),
						(data) => err(data, interaction),
					);
				});
		},
		translation: (interaction) => {
			const reference = interaction.options.getString('reference', true);
			const language = interaction.options.getString('language') ?? 'english';
			const translation = interaction.options.getString('translation');

			const version = `${language}${translation ? `|${translation}` : ''}`;

			sefaria
				.fetchData<TextsResponse>(
					Routes.texts(reference, {
						version,
						return_format: 'strip_only_footnotes',
					}),
				)
				.then((response) => {
					response.match(
						(data) => postText(data, interaction),
						(data) => err(data, interaction),
					);
				});
		},
		both: (interaction) => {
			const reference = interaction.options.getString('reference', true);
			const language = interaction.options.getString('language') ?? 'english';
			const translation = interaction.options.getString('translation');

			const version = `${language}${translation ? `|${translation}` : ''}`;

			sefaria
				.fetchData<TextsResponse>(
					Routes.texts(reference, {
						version: ['source', version],
						return_format: 'strip_only_footnotes',
					}),
				)
				.then((response) => {
					response.match(
						(data) => postMultiText(data, interaction),
						(data) => err(data, interaction),
					);
				});
		},
	},
};
