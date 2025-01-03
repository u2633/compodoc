import { test, expect } from '@playwright/test';

test.describe('Compodoc page', () => {
    test('has title', async ({ page }) => {
        await page.goto('/?q=exampleInput');

        const searchResults = await page.locator('.search-results-item');
        const searchResultsCount = await searchResults.count();
        await expect(searchResultsCount).toEqual(1);
    });
});
