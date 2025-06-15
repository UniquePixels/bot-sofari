import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { CommandSpark } from '../../core/sparks';
import { executeCommand } from './function-registry.ts';

const helpCommand = new SlashCommandBuilder();
helpCommand
	.setName('help')
	.setDescription('Get help using Sofari')
	.addSubcommand((about) =>
		about
			.setName('about')
			.setDescription('Get basic information about Sofari')
			.addBooleanOption((ephemeral) =>
				ephemeral
					.setName('ephemeral')
					.setDescription('Display only to you? (Default true)'),
			),
	)
	.addSubcommand((texts) =>
		texts
			.setName('texts')
			.setDescription(
				'Get detailed information on how to use the texts command.',
			)
			.addBooleanOption((ephemeral) =>
				ephemeral
					.setName('ephemeral')
					.setDescription('Display only to you? (Default true)'),
			),
	)
	.addSubcommand((references) =>
		references
			.setName('references')
			.setDescription('Get information on valid text references')
			.addBooleanOption((ephemeral) =>
				ephemeral
					.setName('ephemeral')
					.setDescription('Display only to you? (Default true)'),
			),
	)
	.addSubcommand((translations) =>
		translations
			.setName('translations')
			.setDescription('Get information on finding and using translations')
			.addBooleanOption((ephemeral) =>
				ephemeral
					.setName('ephemeral')
					.setDescription('Display only to you? (Default true)'),
			),
	);

export class HelpCommand extends CommandSpark {
	id = helpCommand.name;
	command = helpCommand;
	gates = {};

	async execute(interaction: ChatInputCommandInteraction) {
		const ephemeral =
			interaction.options.getBoolean('ephemeral') !== null
				? interaction.options.getBoolean('ephemeral')
				: true;

		try {
			await interaction.deferReply({
				flags: ephemeral ? MessageFlags.Ephemeral : undefined,
			});
		} catch {
			return;
		}

		const cmd = interaction.options.getSubcommand();
		executeCommand(cmd, interaction);
	}
}
