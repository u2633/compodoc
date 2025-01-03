describe('Compodoc page', () => {
    it('should have a search bar, and handle results', async () => {
        await browser.url('http://localhost:4000/?q=exampleInput');
        await browser.waitUntil(
            async () => {
                return await browser.execute(() => document.readyState === 'complete');
            },
            {
                timeout: 10000,
                timeoutMsg: `La page n'était pas chargée après 10s`
            }
        );
        await browser.pause(5000);
        const searchResults = await $$('.search-results-item');
        await expect(searchResults.length).toEqual(1);
    });

    it('should have a search bar, and handle results empty', async () => {
        await browser.url('http://localhost:4000/?q=waza');
        await browser.waitUntil(
            async () => {
                return await browser.execute(() => document.readyState === 'complete');
            },
            {
                timeout: 10000,
                timeoutMsg: `La page n'était pas chargée après 10s`
            }
        );
        await browser.pause(5000);
        const searchResults = await $$('.search-results-item');
        await expect(searchResults.length).toEqual(0);
    });

    it('should support dark mode', async () => {
        const browserName = browser.capabilities.browserName;
        if (browserName === 'chrome') {
            await browser.url('http://localhost:4000/?q=waza');
            await browser.waitUntil(
                async () => {
                    return await browser.execute(() => document.readyState === 'complete');
                },
                {
                    timeout: 10000,
                    timeoutMsg: `La page n'était pas chargée après 10s`
                }
            );
            await browser.pause(5000);
            const $body = await $('body');
            const color = await $body.getCSSProperty('background-color');
            await expect(color.value).toEqual('rgba(33,33,33,1)');
        }
    });

    it('should open menu for specific page', async () => {
        await browser.url('http://localhost:4000/modules.html');
        await browser.waitUntil(
            async () => {
                return await browser.execute(() => document.readyState === 'complete');
            },
            {
                timeout: 10000,
                timeoutMsg: `La page n'était pas chargée après 10s`
            }
        );
        await browser.pause(5000);
        const menuModulesItem = await $('.d-md-block.menu .menu-toggler');
        await expect(menuModulesItem).toHaveElementClass('linked');
    });
});
