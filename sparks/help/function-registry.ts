import { join } from 'node:path';
import dedent from 'dedent';
import {
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js';
import { logException } from '../../core/helpers';

// Define the function signature type
type CommandFunction = (
	interaction: ChatInputCommandInteraction,
) => Promise<void> | void;

// Define the structure type
type FunctionRegistry = {
	[cmd: string]: CommandFunction;
};

export const executeCommand = async (
	cmd: string,
	interaction: ChatInputCommandInteraction,
) => {
	const commandFunction = functions[cmd];

	if (commandFunction) {
		await commandFunction(interaction);
	} else {
		await interaction.reply('Command not found');
	}
};

const functions: FunctionRegistry = {
	about: async (interaction) => {
		const components = [
			new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL('attachment://banner.png'),
			),
			new TextDisplayBuilder().setContent(
				'Sofari provides an interface to the [Sefaria](https://sefaria.org) library of Jewish texts, making it easy to search and post the original texts, translations, and commentaries in Discord chats and DMs.',
			),
			new ContainerBuilder().addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					dedent`The following help commands can be used to explore all of Sofari's features:
									- </help texts:${await getCommandId(interaction, 'help', 'texts')}> - Discover how to post texts in their original languages and translations.
									- More features coming soon...`,
				),
			),

			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),

			new SectionBuilder()
				.setButtonAccessory(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Install  Sofari')
						.setURL(
							'https://discord.com/oauth2/authorize?client_id=1376252581256626187',
						),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						"Sofari can be installed free as a personal application, for use in DMs, group chats, and anywhere on Discord that allows personal apps, or on a server allowing all members of the server to use it's features.",
					),
				),

			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),

			new SectionBuilder()
				.setButtonAccessory(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Obtain Support')
						.setURL('https://discord.gg/Dk8P8h3e9u'),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						'For assistance, to report issues, make feature requests, or see what is coming, please join our development server.',
					),
				),

			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),

			new SectionBuilder()
				.setButtonAccessory(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Support Author')
						.setURL('https://lnk.bio/uniquepixels'),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						'Sofari has been built and hosted by [Unique Pixels](https://uniquepixels.xyz) with :two_hearts: for the Jewish Discord community. There are no fees or premiums to use it. If you want to show your appreciation, consider buying them a coffee :coffee: or something sparkly :sparkles:.',
					),
				),
		];
		try {
			interaction.followUp({
				components,

				files: [
					{
						attachment: join(import.meta.dirname, './assets/banner.png'),
						name: 'banner.png',
					},
				],
				flags: MessageFlags.IsComponentsV2,
			});
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
	},
	texts: async (interaction) => {
		const components = [
			new TextDisplayBuilder().setContent(
				dedent`# Texts Commands
								Sofari provides several commands for posting texts in their original source and translations.`,
			),
			new ContainerBuilder().addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`- </texts post:${await getCommandId(interaction, 'texts', 'post')}>
  - </texts post source:${await getCommandId(interaction, 'texts', 'source')}> *reference* - Retrieve the text specified by the reference and post it using the original language of the text. See </help references:${await getCommandId(interaction, 'help', 'references')}> for more information on valid references.
  - </texts post translation:${await getCommandId(interaction, 'texts', 'translation')}> *reference* *<language>* *<translation>* - Retrieve the text specified by reference and post it using the requested translation.
    - language - This option is optional, if you do not include it, the default language is English.
    - translation - This option is optional, if you do not include it, Sofari will use the primary translation of the language requested. Must use the exact name for Sefaria. See </help translations:${await getCommandId(interaction, 'help', 'translations')}> for more information.
  - </texts post both:${await getCommandId(interaction, 'texts', 'both')}> *reference* *<language>* *<translation>*  - Retrieves the text specified by reference and posts both the original source text and the requested translation.  See above for information on the translation options.`,
				),
			),
		];
		try {
			interaction.followUp({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
	},
	references: (interaction) => {
		try {
			interaction.followUp(
				dedent`# References

								Any command with an option named reference needs a valid Sefaria reference string.  Examples of valid references are:

								- Bereishit
								- Job 3
								- Mishna Berakhot 4.2
								- Sanhedrin 4b
								- Ex. 12:2-8
								- Song_of_Songs.2.4-3.3
								- Berakhot.2a.10-13
								- Rashi on Genesis 1:2:1
								- M. Peah 3
								- Rambam Laws of Repentance 2:1
								- Masekhet Shabbat 7b:12-20
								- Pirkei_Avot_2.1
								- Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Modeh Ani

								More information about valid references and how to format them can be found at: https://developers.sefaria.org/docs/text-references
				`,
			);
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
	},
	translations: (interaction) => {
		try {
			interaction.followUp(
				dedent`Sefaria requires the exact translation name when retrieving a text. Currently, Sofari does not have any way to lookup available translations (we will be adding this in the future).

								You can find available translations by browsing a text on Sefaria and clicking on \`Translations\` in the *Resources* panel (Make sure to get the entire name, with correct punctuation and capitalization.). For example, this link will take you to the translations list for Genesis 1: https://www.sefaria.org/Genesis.1.1?lang=bi&with=Translations&lang2=en`,
			);
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
	},
};

async function getCommandId(
	interaction: ChatInputCommandInteraction,
	commandName: string,
	subcommand: string | null = null,
) {
	try {
		const commands = await interaction.client.application.commands.fetch();
		const command = commands.find((cmd) => cmd.name === commandName);

		if (!command) {
			throw new Error(`Command "${commandName}" not found`);
		}

		// If checking for subcommands, validate they exist
		if (subcommand) {
			// Check for direct subcommand
			const sub = command.options?.find(
				(opt) => opt.type === 1 && opt.name === subcommand, // SUB_COMMAND = 1
			);

			// Check for subcommand group
			const subGroup = command.options?.find(
				(opt) => opt.type === 2 && opt.name === subcommand, // SUB_COMMAND_GROUP = 2
			);

			// If not found as direct subcommand or group, check within subcommand groups
			if (!sub && !subGroup) {
				const subWithinGroup = command.options?.find(
					(opt) =>
						opt.type === 2 && // SUB_COMMAND_GROUP = 2
						opt.options?.some(
							(subOpt) => subOpt.type === 1 && subOpt.name === subcommand,
						),
				);
				if (!subWithinGroup) {
					throw new Error(
						`Subcommand "${subcommand}" not found in command "${commandName}"`,
					);
				}
			}
		}

		return command.id;
	} catch (exception) {
		logException(exception, interaction.client.logger);
		return null;
	}
}
