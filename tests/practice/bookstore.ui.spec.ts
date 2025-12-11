import { test, expect } from '@playwright/test';

test.describe("Bookstore UI Tests", () => {

    test('Intercept request and response when logging in successfully with valid credentials', async ({ page }) => {
        await page.goto('https://demoqa.com/login');
        await page.locator('#userName').fill('testAPIUser14214124');
        await page.locator('#password').fill('Test123!');
        // Interception
        page.on('request', request => console.log('Запит:',
            request.method(), request.url()));
        page.on('response', response => console.log('Відповідь:',
            response.status(), response.url()));

        await page.locator('#login').click();
        await expect(page.locator('#userName-value')).toHaveText('testAPIUser14214124');
    });

    test('Mock book list after login', async ({ page }) => {
        const mockedResponse = {
            "userId": "bd46c1b2-2c25-4a7b-ba0d-5f5da3d4a7b0",
            "username": "testAPIUser14214124",
            "books": [

            ]
        }
        // Mocking


        await page.goto('https://demoqa.com/login');
        await page.locator('#userName').fill('testAPIUser14214124');
        await page.locator('#password').fill('Test123!');

        await page.locator('#login').click();

        await page.route('https://demoqa.com/Account/v1/User/bd46c1b2-2c25-4a7b-ba0d-5f5da3d4a7b0', route => route.fulfill({
            status: 200,
            body: JSON.stringify(mockedResponse),
        }));
    });

});