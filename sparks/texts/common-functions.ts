import clip from '@arendjr/text-clipper';
import dedent from 'dedent';
import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js';
import TurndownService from 'turndown';
import { logException } from '../../core/helpers';
import {
	type ApiError,
	ErrorType,
	type TextsResponse,
} from '../../sefaria_api';

export function postText(
	data: TextsResponse,
	interaction: ChatInputCommandInteraction,
) {
	let parsedText = '';
	if (typeof data.versions[0]?.text === 'string') {
		parsedText = data.versions[0].text;
	} else if (Array.isArray(data.versions[0]?.text)) {
		parsedText = data.versions[0].text.join('\n');
	}

	parsedText = clip(parsedText, 3500, {
		html: true,
		stripTags: ['img', 'svg'],
	});

	const turndown = new TurndownService();
	parsedText = turndown.turndown(parsedText);

	const components = [
		new TextDisplayBuilder().setContent(`### ${data.ref}`),

		new TextDisplayBuilder().setContent(parsedText),
		new SeparatorBuilder()
			.setSpacing(SeparatorSpacingSize.Small)
			.setDivider(true),
		new TextDisplayBuilder().setContent(
			`-# <:sefaria:1377697464689102928> Retrieved from [Sefaria](https://www.sefaria.org/${encodeURIComponent(data.ref)}) - ${data.versions[0]?.versionTitle}`,
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
}

export function postMultiText(
	data: TextsResponse,
	interaction: ChatInputCommandInteraction,
) {
	const parsedText: [string, string] = ['', ''];

	if (typeof data.versions[0]?.text === 'string') {
		parsedText[0] = data.versions[0].text;
	} else if (Array.isArray(data.versions[0]?.text)) {
		parsedText[0] = data.versions[0].text.join('\n');
	}

	if (typeof data.versions[1]?.text === 'string') {
		parsedText[1] = data.versions[1].text;
	} else if (Array.isArray(data.versions[1]?.text)) {
		parsedText[1] = data.versions[1].text.join('\n');
	}

	const truncated: [string, string] = ['', ''];
	if (parsedText[0].length > 1900) {
		truncated[0] = ' (Text truncated)';
	}
	if (parsedText[1].length > 1900) {
		truncated[1] = ' (Text truncated)';
	}

	parsedText[0] = clip(parsedText[0], 1900, {
		html: true,
		stripTags: ['img', 'svg'],
	});

	parsedText[1] = clip(parsedText[1], 1900, {
		html: true,
		stripTags: ['img', 'svg'],
	});

	const turndown = new TurndownService();
	parsedText[0] = turndown.turndown(parsedText[0]);
	parsedText[1] = turndown.turndown(parsedText[1]);

	const components = [
		new TextDisplayBuilder().setContent(`## ${data.ref}`),

		new TextDisplayBuilder().setContent(parsedText[0]),
		new SeparatorBuilder()
			.setSpacing(SeparatorSpacingSize.Small)
			.setDivider(true),
		new TextDisplayBuilder().setContent(parsedText[1]),

		new SeparatorBuilder()
			.setSpacing(SeparatorSpacingSize.Small)
			.setDivider(true),
		new TextDisplayBuilder().setContent(
			`-# <:sefaria:1377697464689102928> Retrieved from [Sefaria](https://www.sefaria.org/${encodeURIComponent(data.ref)}) - ${data.versions[0]?.versionTitle} / ${data.versions[1]?.versionTitle}`,
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
}

export function err(data: ApiError, interaction: ChatInputCommandInteraction) {
	if (data.errorType === ErrorType.SYSTEM) {
		try {
			interaction.followUp({
				content: dedent`An system error occurred trying to fetch text. Please try again later.
												-# Error has been logged.`,
			});
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
		logException(JSON.stringify(data), interaction.client.logger);
	}
	if (data.errorType === ErrorType.USER_INPUT) {
		try {
			interaction.followUp({
				content: dedent`${data.message}`,
			});
		} catch (exception) {
			logException(exception, interaction.client.logger);
		}
	}
}
