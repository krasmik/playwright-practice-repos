import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { getRandomElementFromList } from "../utils/getElements";


test.describe('Product List Page tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })

    test('Opening PDP page by clicking product name', async ({ page }) => {
        // Get number of products on page
        const numberOfProducts = await page.locator('[data-test="inventory-item-name"]').count();
        console.log(numberOfProducts);
        // Select random index of product
        const randomProductIndex = Math.floor(Math.random() * numberOfProducts);
        console.log(randomProductIndex);
        // Get name of the selected product and save it 
        const productName = await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).textContent();
        console.log(productName);
        // Click on the name
        await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).click();
        // Verify 
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName!);

    })

    test('Adding product to cart', async ({ page }) => {
        // Get number of products on page
        const numberOfProducts = await page.locator('[data-test="inventory-item-name"]').count();
        console.log(numberOfProducts);
        // Select random index of product
        const randomProductIndex = Math.floor(Math.random() * numberOfProducts);
        console.log(randomProductIndex);

        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    })

    test('Removing product from cart', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));

        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Add to cart');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    })

    test.describe('Sorting', () => {

        test('Default filter option is "Name (A to Z)" ', async ({ page }) => {
            await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
        })

        test('Sort by price - low to high', async ({ page }) => {
            
        })
    })
})