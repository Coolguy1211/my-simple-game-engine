/**
 * Dynamically loads and instantiates script components based on configuration.
 * @param {Array<Object>} scriptConfigs - An array of script configurations.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of script component instances.
 */
export async function loadScripts(scriptConfigs) {
    const components = await Promise.all(scriptConfigs.map(async (config) => {
        const { type, ...params } = config;
        try {
            const module = await import(`../scripts/${type}.js`);
            const ComponentClass = module.default;
            if (typeof ComponentClass !== 'function') {
                throw new Error(`Module ../scripts/${type}.js does not export a default class.`);
            }
            // Instantiate the component class with its parameters
            return new ComponentClass(params);
        } catch (error) {
            console.error(`Failed to load or instantiate script component: ${type}`, error);
            return null;
        }
    }));
    // Filter out any components that failed to load
    return components.filter(c => c !== null);
}