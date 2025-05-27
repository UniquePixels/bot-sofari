import { SecretsVault } from '@sparkbot/plugin-secrets';
import * as v from 'valibot';
import { secretsVaultPluginConfig } from '../../.sparkbot.config.js';
import { loadPlugin } from '../plugin-manager';
import { byEnv } from './by-env.js';

/**
 * A schema that describes the configuration of a secrets vault plugin.
 */
const SecretsVaultPluginConfigSchema = byEnv(
	v.object({
		module: v.string(),
		options: v.optional(v.record(v.string(), v.unknown())),
	}),
);

export type SecretsVaultPluginConfig = v.InferInput<
	typeof SecretsVaultPluginConfigSchema
>;

/**
 * Creates a schema that describes a secret value transformation, which
 * takes a key as input and transforms it into the value retrieved from
 * the configured secrets vault.
 */
export async function createSecretSchema() {
	// Initialize the vault plugin
	const vaultConfig = v.parse(
		SecretsVaultPluginConfigSchema,
		secretsVaultPluginConfig,
	);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const SecretsVaultPlugin = await loadPlugin<SecretsVault>(
		SecretsVault,
		vaultConfig.module,
	);
	const secretsVault = new SecretsVaultPlugin(vaultConfig.options);

	return v.pipeAsync(
		v.object({ secretVaultKey: v.string() }),
		v.transformAsync(async (input) => secretsVault.get(input.secretVaultKey)),
	);
}
