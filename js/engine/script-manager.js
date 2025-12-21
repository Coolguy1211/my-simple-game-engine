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
                // Inline scripts are disabled due to security risks.
                throw new Error('Inline scripts are not supported. Use file-based scripts instead.');
            }

            if (type) {
                // Load from an external file
                const module = await import(`../scripts/${type}.js`);
                ComponentClass = module.default;
            } else {
                throw new Error('Script configuration must have a `type`.');
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
