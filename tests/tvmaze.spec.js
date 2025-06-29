import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.tvmaze.com';

test.describe('TV Maze API - Breaking Bad Test', () => {
    let showId;

    //  Haal de juiste showId op
    test.beforeAll(async ({ request }) => {
        const response = await request.get(`${BASE_URL}/search/shows?q=breaking bad`);
        expect(response.status()).toBe(200);

        const data = await response.json();
        const breakingBad = data.find(item => item.show.name.toLowerCase() === 'breaking bad');
        expect(breakingBad).toBeDefined();
        showId = breakingBad.show.id;
        console.log({showId})
    });

    // Gebruik showId en controleer URL met ID
    test('Haal Breaking Bad show info op en controleer URL met ID', async ({ request }) => {
        expect(showId).toBeDefined();
        const response = await request.get(`${BASE_URL}/shows/${showId}`);
        expect(response.status()).toBe(200);

        // Check URL met ID
        const show = await response.json();
        expect(show.url).toBeDefined();
        expect(show.url).toContain(showId.toString());
        console.log({show})
    });
});