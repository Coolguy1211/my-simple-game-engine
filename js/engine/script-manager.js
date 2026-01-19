/**
 * Dynamically loads and instantiates script components based on configuration.
 * @param {Array<Object>} scriptConfigs - An array of script configurations.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of script component instances.
 */
export async function loadScripts(scriptConfigs) {
    const components = await Promise.all(scriptConfigs.map(async (config) => {
        const { type, source, ...params } = config;

        try {
            let ComponentClass;

            if (source) {
                // CRITICAL SECURITY VULNERABILITY: Inline script execution was removed.
                // The 'source' property in scene files allowed arbitrary code execution,
                // which is a major security risk (RCE). All scripts must be loaded
                // from trusted files in the 'js/scripts/' directory.
                throw new Error(
                    'Inline scripts (using the "source" property) are disabled for security reasons. ' +
                    'Load all scripts from external files using the "type" property.'
                );
            } else if (type) {
                // Otherwise, load from an external file
                const module = await import(`../scripts/${type}.js`);
                ComponentClass = module.default;
            } else {
                throw new Error('Script configuration must have a type.');
            }

            if (typeof ComponentClass !== 'function') {
                throw new Error('The script did not resolve to a class.');
            }

            // Instantiate the component class with its parameters
            return new ComponentClass(params);
        } catch (error) {
            console.error(`Failed to load or instantiate script component: ${type || 'inline'}`, error);
            return null;
        }
    }));

    // Filter out any components that failed to load
    return components.filter(c => c !== null);
}
