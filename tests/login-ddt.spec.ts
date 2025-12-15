import test, { expect } from "@playwright/test";
import LoginPage from "../pom/pages/LoginPage";

let loginPage: LoginPage;
test.describe('Login tests with DDT', () => {
    const loginTestData = [
        { userName: 'standard_user', password: 'secret_sauce', success: true },
        { userName: 'locked_out_user', password: 'secret_sauce', success: false, errorMessage: 'Epic sadface: Sorry, this user has been locked out.' },
        { userName: 'problem_user', password: 'secret_sauce', success: true },
        { userName: 'performance_glitch_user', password: 'secret_sauce', success: true },
        { userName: 'error_user', password: 'secret_sauce', success: true },
        { userName: 'visual_user', password: 'secret_sauce', success: true }
    ]

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    for (const data of loginTestData) {
        test(`Login test with username: ${data.userName}`, async ({ page }) => {
            await loginPage.loginWithCredentials(data.userName, data.password);

            if (data.success) {
                await expect(page).toHaveURL('/inventory.html');
            } else {
                await expect(loginPage.errorMessage).toHaveText(data.errorMessage!);
            }
        });
    };
});