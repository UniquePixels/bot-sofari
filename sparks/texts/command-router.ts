import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { CommandSpark } from '../../core/sparks';
import { executeCommand } from './function-registry.ts';

const textsCommand = new SlashCommandBuilder();
textsCommand
	.setName('texts')
	.setDescription('Post a text or translation.')
	.addSubcommandGroup((post) =>
		post
			.setName('post')
			.setDescription('Post a text or translation.')
			.addSubcommand((source) =>
				source
					.setName('source')
					.setDescription('Post a text using the primary source version.')
					.addStringOption((reference) =>
						reference
							.setName('reference')
							.setDescription(
								'The reference to the text to post. See /help reference for more details on valid references.',
							)
							.setRequired(true),
					),
			)
			.addSubcommand((translation) =>
				translation
					.setName('translation')
					.setDescription(
						'Post a text using a selected language or translation.',
					)
					.addStringOption((reference) =>
						reference
							.setName('reference')
							.setDescription(
								'The reference to the text to post. See /help reference for more details on valid references.',
							)
							.setRequired(true),
					)
					.addStringOption((language) =>
						language
							.setName('language')
							.setDescription('Choose the language (Default English)')
							.addChoices([
								{ name: 'Hebrew', value: 'hebrew' },
								{ name: 'English', value: 'english' },
								{ name: 'Arabic', value: 'arabic' },
								{ name: 'Catalan', value: 'catalan' },
								{ name: 'Czech', value: 'czech' },
								{ name: 'German', value: 'german' },
								{ name: 'Esperanto', value: 'esperanto' },
								{ name: 'Spanish', value: 'spanish' },
								{ name: 'Persian', value: 'persian' },
								{ name: 'Finnish', value: 'finnish' },
								{ name: 'French', value: 'french' },
								{ name: 'Hungarian', value: 'hungarian' },
								{ name: 'Italian', value: 'italian' },
								{ name: 'Korean', value: 'korean' },
								{ name: 'Ladino', value: 'ladino' },
								{ name: 'Polish', value: 'polish' },
								{ name: 'Portuguese', value: 'portuguese' },
								{ name: 'Russian', value: 'russian' },
								{ name: 'Yiddish', value: 'yiddish' },
							]),
					)
					.addStringOption((translation) =>
						translation
							.setName('translation')
							.setDescription(
								'(Optional) The full title of the translation to use. (See /help translations for details)',
							),
					),
			)
			.addSubcommand((both) =>
				both
					.setName('both')
					.setDescription('Post a text source and translation.')
					.addStringOption((reference) =>
						reference
							.setName('reference')
							.setDescription(
								'The reference to the text to post. See /help reference for more details on valid references.',
							)
							.setRequired(true),
					)
					.addStringOption((language) =>
						language
							.setName('language')
							.setDescription('Choose the language (Default English)')
							.addChoices([
								{ name: 'Hebrew', value: 'hebrew' },
								{ name: 'English', value: 'english' },
								{ name: 'Arabic', value: 'arabic' },
								{ name: 'Catalan', value: 'catalan' },
								{ name: 'Czech', value: 'czech' },
								{ name: 'German', value: 'german' },
								{ name: 'Esperanto', value: 'esperanto' },
								{ name: 'Spanish', value: 'spanish' },
								{ name: 'Persian', value: 'persian' },
								{ name: 'Finnish', value: 'finnish' },
								{ name: 'French', value: 'french' },
								{ name: 'Hungarian', value: 'hungarian' },
								{ name: 'Italian', value: 'italian' },
								{ name: 'Korean', value: 'korean' },
								{ name: 'Ladino', value: 'ladino' },
								{ name: 'Polish', value: 'polish' },
								{ name: 'Portuguese', value: 'portuguese' },
								{ name: 'Russian', value: 'russian' },
								{ name: 'Yiddish', value: 'yiddish' },
							]),
					)
					.addStringOption((translation) =>
						translation
							.setName('translation')
							.setDescription(
								'(Optional) The full title of the translation to use. (See /help translations for details)',
							),
					),
			),
	);

export class Texts extends CommandSpark {
	id = textsCommand.name;
	command = textsCommand;
	gates = {};

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();
		} catch {
			return;
		}

		const group = interaction.options.getSubcommandGroup(true);
		const cmd = interaction.options.getSubcommand();
		executeCommand(group, cmd, interaction);
	}
}
