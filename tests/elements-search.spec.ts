import test from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto('');
})

test('Get element by selector', async ({ page }) => {

    const inputs = page.locator('//input[@type="submit"]', { hasNotText: 'Registration' });
    await page.locator('//input[@type="submit"]', { hasNotText: 'Registration' }).highlight();
    await page.locator('//div', { hasNot: page.locator('.login_container') }).highlight();

})

test('Get element by getByText ', async ({ page }) => {
    await page.getByText('Login').highlight();
})

test('Get element by getByRole ', async ({ page }) => {
    await page.getByRole('button').highlight();
})

test('Get element by getByPlaceholder ', async ({ page }) => {
    await page.getByPlaceholder('Password').highlight();
})

test('filter', async ({ page }) => {
    await page.getByRole('button').filter({ hasText: 'Login' }).highlight();
})

test('multiple elements', async ({ page }) => {
    // await page.locator('input', { hasNotText: 'Login' }).nth(0).fill('Text');


    const textFieldS = await page.locator('input', { hasNotText: 'Login' }).all();
    
    for (const field of textFieldS) {
        await field.fill('1000');
    }

    console.log(textFieldS.length)
})