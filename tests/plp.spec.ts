import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { getRandomElementIndexFromList, parsePrices, sortNumbersAscending } from "../utils/getElements";
import LoginPage from "../pom/pages/LoginPage";
import ProductsPage from "../pom/pages/ProductsPage";
import ProductDetailsPage from "../pom/pages/ProductDetailsPage";
import Header from "../pom/modules/Header";
import { Urls } from "../test-data/urls";

let loginPage: LoginPage;
let productsPage: ProductsPage;
let productDetailsPage: ProductDetailsPage;
let header: Header;

test.describe('Product List Page tests with POM', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        header = new Header(page);

        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.title).toBeVisible();
    })

    test('Opening PDP page by clicking product name', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        const productName = await productsPage.getProductNameByIndex(randomProductIndex);
        await productsPage.clickOnProductByIndex(randomProductIndex);
        await expect(productDetailsPage.productName).toHaveText(productName!);
    })

    test('Adding product to cart', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Remove');
        await expect(header.cartIcon).toHaveText('1');
    })

    test('Removing product from cart', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Remove');
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Add to cart');
        await expect(header.cartIcon).not.toBeVisible();
    })

    test.describe('Sorting', () => {

        test('Default filter option is "Name (A to Z)" ', async () => {
            await expect(productsPage.sortDropdown).toHaveValue('az');
        })

        test('Sort by price - low to high', async () => {
            // Get all prices with default sorting
            const pricesBeforeSorting = await productsPage.getAllPrices();
            const pricesBeforeSortingNumbers = parsePrices(pricesBeforeSorting);
            await productsPage.sortBy('lohi');
            const pricesAfterSorting = await productsPage.getAllPrices();
            const pricesAfterSortingNumbers = parsePrices(pricesAfterSorting);
            const pricesBeforeSortingNumbersSorted = sortNumbersAscending(pricesBeforeSortingNumbers);
            expect(pricesAfterSortingNumbers).toEqual(pricesBeforeSortingNumbersSorted);
        })
    })
})

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
        const randomProductIndex = await getRandomElementIndexFromList(page.locator('[data-test="inventory-item-name"]'));

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