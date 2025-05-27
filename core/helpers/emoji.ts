import type { Client } from 'discord.js';
import { logException } from './error';

export async function getAppEmoji(client: Client<true>, emojiName: string) {
	// Cache all application emojis
	try {
		await client.application?.emojis.fetch();
	} catch (exception) {
		logException(exception, client.logger);
	}

	const emoji = client.application.emojis.cache.find(
		(e) => e.name === emojiName,
	);
	if (!emoji) {
		throw new Error(`Emoji not found: ${emojiName}`);
	}
	return emoji;
}
