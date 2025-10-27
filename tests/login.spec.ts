import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { LoginErrors } from "../test-data/errors";
import { faker } from '@faker-js/faker';
import LoginPage from "../pom/pages/LoginPage";
import ProductsPage from "../pom/pages/ProductsPage";
import { Urls } from "../test-data/urls";

let loginPage: LoginPage;
let productsPage: ProductsPage;

test.describe('Login tests with POM', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);

        await loginPage.navigate();
    })

    test('Successful login', async ({ page }) => {
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.title).toBeVisible();
        // await productsPage.verifyPageIsOpen();
    })

    test('Login without username', async () => {
        await loginPage.enterPassword(standardUser.password);
        await loginPage.clickLoginButton();
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.EMPTY_USERNAME_MESSAGE);
    })

    test('Login without password', async () => {
        await loginPage.enterUsername(standardUser.username);
        await loginPage.clickLoginButton();
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.EMPTY_PASSWORD_MESSAGE);
    })

    test('Login with invalid credentials', async () => {
        await loginPage.loginWithCredentials(faker.internet.username(), faker.internet.password());
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.INVALID_DATA_MESSAGE);
    })
})

test.describe('Login tests without POM', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Successful login', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })

    test('Login without username', async ({ page }) => {
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText(LoginErrors.EMPTY_USERNAME_MESSAGE);
    })

    test('Login without password', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText(LoginErrors.EMPTY_PASSWORD_MESSAGE);
    })

    test('Login with invalid credentials', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(faker.internet.username());
        await page.locator('[data-test="password"]').fill(faker.internet.password());
        await page.locator('[data-test="login-button"]').click();
    })
})