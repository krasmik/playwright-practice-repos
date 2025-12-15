import BasePage from "../BasePage";

export default class Header extends BasePage {

    public readonly cartIcon = this.page.locator('[data-test="shopping-cart-badge"]');
}