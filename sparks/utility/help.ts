import { join } from 'node:path';
import dedent from 'dedent';
import {
	type ChatInputCommandInteraction,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js';
import { CommandSpark } from '../../core/sparks';

const cmd = new SlashCommandBuilder();
cmd
	.setName('help')
	.setDescription('Get help and a list of commands for Sofari')
	.addBooleanOption((option) =>
		option
			.setName('public')
			.setDescription(
				'Whether to make this reply visible to everyone in the channel, defaults to false',
			)
			.setRequired(false),
	);

export class Help extends CommandSpark {
	id = cmd.name;
	command = cmd;
	gates = {};

	execute(interaction: ChatInputCommandInteraction) {
		const components = [
			new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL('attachment://banner.png'),
			),
			new TextDisplayBuilder().setContent(
				'Sofari provides an interface to the [Sefaria](https://sefaria.org) library of Jewish texts, making it easy to post the original texts, translations, and commentaries in Discord chats and DMs.',
			),
			new ContainerBuilder().addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					dedent`## Commands:
								- </source:1377812073710620754> *reference* - Posts the source text of the given reference.
								- </english:1379201513980952708> *reference* - Posts the primary English translation of the given reference.
								- </help:1377812073710620756> - Displays this help message`,
				),
			),
			new ContainerBuilder().addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					dedent`### Notes:
								- *reference* can be any valid Sefaria reference, such as "Genesis 1:1", "Exodus 20:13-21", or "Talmud Berakhot 2a".
								- Any text over 3500 characters will be automatically truncated.
								- **These commands will change in the future!** This is a work in progress, and more commands will be added soon.`,
				),
			),
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
			new TextDisplayBuilder().setContent(
				'Please join the [development server](https://discord.gg/Dk8P8h3e9u) for help or to submit a feature request.',
			),
			new TextDisplayBuilder().setContent(
				'This project is maintained and hosted as a hobby of :two_hearts: for the Jewish Discord community, by <@1123411105289601115>.  There are no fees or premiums to use it. If you want to show your appreciation, consider [buying them a coffee](https://lnk.bio/uniquepixels).',
			),
		];

		let messageFlags: number;
		if (interaction.options.getBoolean('public')) {
			messageFlags = MessageFlags.IsComponentsV2;
		} else {
			messageFlags = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;
		}

		try {
			interaction.reply({
				components,

				files: [
					{
						attachment: join(import.meta.dirname, './assets/banner.png'),
						name: 'banner.png',
					},
				],
				flags: messageFlags,
			});
		} catch {
			return;
		}
	}
}
