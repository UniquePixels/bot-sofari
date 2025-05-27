import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { Client } from 'discord.js';
import { Spark } from './spark.ts';

export async function sparkLoader(client: Client) {
	const importPath = join(import.meta.dir, '../../sparks/');
	const fileList = readdirSync(importPath, { recursive: true });

	const importedFiles: unknown[] = [];
	for (const file of fileList) {
		if (
			typeof file === 'string' &&
			extname(file) === '.ts' &&
			!file.includes('lib/')
		)
			importedFiles.push(import(join(importPath, file)) as unknown);
	}

	await Promise.all(importedFiles)
		// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
		.then((value) => {
			for (const module of value) {
				if (module && typeof module === 'object') {
					for (const item of Object.values(module)) {
						if (isClass(item) && doesClassExtend(item, Spark)) {
							const instance = new item(client); // eslint-disable-line new-cap
							if (instance instanceof Spark) instance.register();
						}
					}
				}
			}
		})
		.catch((exception: unknown) => {
			if (exception instanceof Error) throw exception;
			throw new Error(String(exception));
		});
}

type Arguments = readonly unknown[];
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Constructor<A extends Arguments = readonly any[], R = any> = new (
	...args: A
) => R;

/**
 * Verify if an object is a class constructor.
 * @param input The function to verify
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isClass<T>(input: unknown): input is new (...args: any[]) => T {
	return typeof input === 'function' && typeof input.prototype === 'object';
}

/**
 * Verifies that a class extends another class
 * @param value Class to check
 * @param base Class to compare to
 * @returns boolean
 */
export function doesClassExtend<T>(value: Constructor, base: T) {
	// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
	let constructor: Constructor | null = value;
	while (constructor !== null) {
		if (constructor === base) return true;
		constructor = Object.getPrototypeOf(constructor); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
	}

	return false;
}
