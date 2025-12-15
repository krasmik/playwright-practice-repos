import test, { expect } from "@playwright/test";
import { books } from "../../test-data/api/books";

test.describe("Bookstore API Tests", () => {

    test.describe('Public API requests without authentication', () => {
        test('Get all books', async ({ request }) => {
            const response = await request.get('https://demoqa.com/BookStore/v1/Books');
            const responseBody = await response.json();
            const books = responseBody.books;

            expect(response.status()).toBe(200);
            expect(books).toHaveLength(8);
        });
    });

    test.describe('Authenticated API requests', () => {
        let token: string;
        const userId = 'bd46c1b2-2c25-4a7b-ba0d-5f5da3d4a7b0';

        test.beforeAll(async ({ request }) => {
            const responseAuth = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
                data: {
                    "userName": "testAPIUser14214124",
                    "password": "Test123!"

                }
            });

            const responseAuthBody = await responseAuth.json();
            token = responseAuthBody.token;
        });

        test('Get user books', async ({ request }) => {
            const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseBody = await response.json();
            const books = responseBody.books;
            expect(response.status()).toBe(200);
            expect(books).toHaveLength(2);

        });

        test('Generate token with valid credentials', async ({ request }) => {
            const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
                data: {
                    "userName": "testAPIUser14214124",
                    "password": "Test123!"

                }
            });
            const responseBody = await response.json();
            expect(response.status()).toBe(200);
            expect(responseBody.token).toBeDefined();
        });

        test('Add a book to user collection', async ({ request }) => {
            const response = await request.post('https://demoqa.com/BookStore/v1/Books', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    "userId": userId,
                    "collectionOfIsbns": [
                        {
                            "isbn": books[3].isbn
                        }
                    ]
                }
            });

            const responseBody = await response.json();
            const addedIsbn = responseBody.books[0].isbn;
            expect(response.status()).toBe(201);
            expect(addedIsbn).toBe(books[3].isbn);
        });




    });
});