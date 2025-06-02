import sefaria from '@api/sefaria';
import {
	type ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js';
import { CommandSpark } from '../core/sparks';

const cmd = new SlashCommandBuilder();
cmd
	.setName('english')
	.setDescription('Post the primary english translation for a given reference.')
	.addStringOption((option) =>
		option
			.setName('reference')
			.setDescription('The reference of the text. For example: "Genesis 1:1"')
			.setRequired(true),
	);

export class English extends CommandSpark {
	id = cmd.name;
	command = cmd;
	gates = {};

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();
		} catch {
			return;
		}

		const reference = interaction.options.getString('reference', true);

		sefaria
			.getV3Texts({
				tref: reference,
				version: 'english',
				return_format: 'text_only',
			})
			.then((response) => {
				let parsedText = '';

				if (typeof response.data.versions?.[0]?.text === 'string') {
					parsedText = response.data.versions[0].text;
				} else if (Array.isArray(response.data.versions?.[0]?.text)) {
					parsedText = response.data.versions[0].text.join('\n');
				} else {
					try {
						interaction.followUp({
							content: `No english text found for ${reference}.`,
						});
						return;
					} catch {
						return;
					}
				}

				let truncated = '';

				if (parsedText.length > 3500) {
					parsedText = parsedText.slice(0, 3500);
					//Find the last space in the description to slice at a word boundary
					const sliceIndex = parsedText.search(/\s\S+\s*$/);
					parsedText = `${parsedText.slice(0, sliceIndex)}...`;
					truncated = ' (truncated)';
				}

				const components = [
					new TextDisplayBuilder().setContent(
						`**${response.data.ref}**${truncated}`,
					),
					new ContainerBuilder().addTextDisplayComponents(
						new TextDisplayBuilder().setContent(parsedText),
					),
					new TextDisplayBuilder().setContent(
						`-# <:sefaria:1377697464689102928> Retrieved from [Sefaria](https://www.sefaria.org/${encodeURIComponent(response.data.ref ?? '')})`,
					),
				];
				try {
					interaction.followUp({
						components: components,
						flags: MessageFlags.IsComponentsV2,
					});
				} catch (error) {
					console.log(error);
					return;
				}
			})
			.catch(() => {
				try {
					interaction.followUp({
						content: `No english text found for ${reference}.`,
					});
					return;
				} catch {
					return;
				}
			});
	}
}
