import { ActivityType } from 'discord.js';
import type {
	SecretsVaultPluginConfig,
	SparkBotConfig,
} from './core/configuration';

export const secretsVaultPluginConfig: SecretsVaultPluginConfig = {
	module: '@sparkbot/plugin-secrets',
};

export const appConfig: SparkBotConfig = {
	discordAPIKey: { secretVaultKey: 'discordAPIKey' },
	discordAppID: '1376252581256626187',
	discordIntents: [],
	enabledPartials: [],
	defaultPresence: {
		status: 'online',
		activities: [
			{ type: ActivityType.Listening, name: 'to the words of Torah' },
		],
	},
	loggingLibraryPlugin: {
		prod: {
			module: '@sparkbot/plugin-logger',
			options: {
				loggingLevel: 'info',
				transports: [
					{
						target: '@axiomhq/pino',
						options: {
							dataset: 'app-logs-pix',
							token: { secretVaultKey: 'axiomAPIToken' },
						},
						level: 'info',
					},
				],
			},
		},
		dev: {
			module: '@sparkbot/plugin-logger',
			options: {
				loggingLevel: 'debug',
				transports: [
					{
						target: 'pino-pretty',
						options: {
							colorize: true,
						},
					},
				],
			},
		},
	},
	devMaps: {
		channels: {},
		roles: {},
		emojis: {},
	},
};
