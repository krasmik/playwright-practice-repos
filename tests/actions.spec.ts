import test, { expect } from "@playwright/test";

test.describe('Actions and Assertions practice', () => {

    test('Checkbox', async ({ page }) => {
        await page.goto('https://www.qa-practice.com/elements/checkbox/mult_checkbox');
        await page.locator('#id_checkboxes_0').check();
        await page.locator('#id_checkboxes_1').check();
        await expect(page.locator('#id_checkboxes_0')).toBeChecked();
        await expect(page.locator('#id_checkboxes_1')).toBeChecked();
        await page.locator('#id_checkboxes_0').uncheck();
        await page.locator('#id_checkboxes_1').uncheck();
        await expect(page.locator('#id_checkboxes_0')).not.toBeChecked();
        await expect(page.locator('#id_checkboxes_1')).not.toBeChecked();
    })

    test('Click', async ({ page }) => {
        await page.locator('').click({ button: 'right' })
    })

    test('hover', async ({ page }) => {
        await page.goto('https://www.qamadness.com/');
        await page.getByText('Get a quote', { exact: true }).first().hover();
    })

    test('text fields', async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill('testusername');
        await page.locator('#user-name').fill('testusername');
        await page.locator('#user-name').clear();
        await page.locator('#user-name').pressSequentially('testusername', { delay: 300 });
        await expect(page.locator('#user-name')).toHaveValue('testusername');

    })

    test('dropdowns', async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await expect(page.locator('.title', { hasText: 'Products' })).toBeVisible();

        await page.locator('[data-test="product-sort-container"]').selectOption('Name (Z to A)');
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');
        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');

        // await expect(page.locator('.title', { hasText: 'Products' })).toHaveAttribute('placeholder', 'Password');
        // await expect(page.locator('.title', { hasText: 'Products' })).toHaveCSS('bottom-border-color', 'rgb(226 35 26)')

    })

})
