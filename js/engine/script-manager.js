export async function loadScripts(scriptConfigs) {
    const scripts = await Promise.all(scriptConfigs.map(async (config) => {
        const { type, ...params } = config;
        try {
            const module = await import(`../scripts/${type}.js`);
            return {
                type,
                init: module.default.init,
                update: module.default.update,
                params
            };
        } catch (error) {
            console.error(`Failed to load script: ${type}`, error);
            return null;
        }
    }));
    return scripts.filter(s => s !== null);
}