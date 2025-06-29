import {test, expect, request} from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('Weergeef foutmelding zonder API key', async ({request}) => {
    const response = await request.get('https://api.openweathermap.org/data/2.5/weather?q=Utrecht');

    expect(response.status()).toBe(401); // verwacht status (foutmelding) 401

    const body = await response.json();
    expect(body.message).toMatch(/invalid api key/i);
});

test('Geldige API key moet status 200 geven', async ({ request }) => {
    const response = await request.get(`https://api.openweathermap.org/data/2.5/weather?q=Utrecht&appid=${process.env.OPENWEATHER_KEY}`); // gebruikt de API key in .env
    
    expect(response.status()).toBe(200); //verwacht status 200

    const body = await response.json();

    expect(body.name).toMatch(/Provincie Utrecht/i); // Controleren op juiste locatie
});

test('Stad onbekend, typefout (Utregt) status 404', async ({ request }) => {
    const response = await request.get(`https://api.openweathermap.org/data/2.5/weather?q=Utregt&appid=${process.env.OPENWEATHER_KEY}`); // gebruikt de API key in .env

    expect(response.status()).toBe(404); //verwacht status 404

    const body = await response.json();

    expect(body.name).toBeUndefined();
});

// Opdracht 4: Dynamisch ophalen en valideren van stad IDs
const steden = [
    {naam: 'Amsterdam'},
    {naam: 'Rotterdam'},
    {naam: 'Den Haag'},
    {naam: 'Groningen'}
];

let context;

test.describe('Opdracht 4 - Dynamische ID validatie', () => {
    test.beforeAll(async () => {
        context = await request.newContext();
        for (const stad of steden) {
        const response = await context.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(stad.naam)}&appid=${process.env.OPENWEATHER_KEY}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        stad.id = body.id; 
        }
        console.log('City, Id');
        steden.forEach(s => console.log(`${s.naam}, ${s.id}`));
    });

    for (const stad of steden) {
        test(`Opdracht 4 - ${stad.naam} heeft een geldige ID`, async () => {
            // controleer of de ID overeenkomt met eerder opgehaalde waarde
            const response = await context.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(stad.naam)}&appid=${process.env.OPENWEATHER_KEY}`);
            expect(response.status()).toBe(200);

            const body = await response.json();
            const expectedId = stad.id;
            expect(body.id).toBe(expectedId);
        });
    }
});