import { join } from 'node:path';
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
	.setDescription('Get help with using Sofari')
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
				'Sofari provides an interface to the [Sefaria](https://sefaria.org) library of Jewish texts, making it easy to post the original text, translations, and commentaries.',
			),
			new ContainerBuilder().addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					'## Commands:\n- </source:1377812073710620754> *reference* - Posts the source text of the given reference.\n\n- </help:1377812073710620756> - Displays this help message\n\n-# Note: Any text over 3500 characters will be automatically truncated.',
				),
			),
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
			new TextDisplayBuilder().setContent(
				"If you need help or want to suggest a new feature, please join <@1123411105289601115>'s [development server](https://discord.gg/Dk8P8h3e9u).",
			),
			new TextDisplayBuilder().setContent(
				'I maintain and host this application as a hobby of :two_hearts: for the Jewish Discord community.  If you appreciate it and want to do so, you can [tip me](https://lnk.bio/uniquepixels).',
			),
			new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL('attachment://powered.png'),
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
					{
						attachment: join(import.meta.dirname, './assets/powered.png'),
						name: 'powered.png',
					},
				],
				flags: messageFlags,
			});
		} catch {
			return;
		}
	}
}
