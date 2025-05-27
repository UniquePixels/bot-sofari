import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import * as v from 'valibot';
import { byEnv, byEnvAsync } from './by-env.ts';
import * as s from './schema-pieces.ts';

/**
 * A schema that describes the configuration of a Spark⚡️Bot
 */
const SparkBotConfigSchema = v.objectAsync({
	discordAPIKey: byEnvAsync(s.SecretValueConfigSchema),
	discordAppID: byEnv(s.SnowflakeConfigSchema),
	discordIntents: v.array(v.enum(GatewayIntentBits)),
	enabledPartials: v.array(v.enum(Partials)),
	defaultPresence: v.object({
		status: v.picklist(['online', 'idle', 'dnd', 'invisible']),
		activities: v.array(
			v.object({
				name: v.string(),
				type: v.enum_(ActivityType),
			}),
		),
	}),
	loggingLibraryPlugin: byEnvAsync(s.PluginConfigSchema),
	devMaps: v.object({
		channels: v.record(v.string(), byEnv(v.string())),
		emojis: v.record(v.string(), byEnv(v.string())),
		roles: v.record(v.string(), byEnv(v.string())),
	}),
});

/**
 * Defines the configuration object specified in sparkbot.config.ts
 */
export type SparkBotConfig = v.InferInput<typeof SparkBotConfigSchema>;

/**
 * Export parsed configuration.
 */

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function getConfig(config: SparkBotConfig) {
	return v.parseAsync(SparkBotConfigSchema, config);
}

export type Config = v.InferOutput<typeof SparkBotConfigSchema>;
export type { SecretsVaultPluginConfig } from './secrets.ts';
