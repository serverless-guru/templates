const puppeteer = require('puppeteer')

// * * * * * * * * * * * * * * * * * * * * * * * * * 
// CONFIG
// * * * * * * * * * * * * * * * * * * * * * * * * * 
const localConfig = {
    endpoint: 'http://localhost:3000',
    puppeteerConfig: {
        headless: false,
        slowMo: 20
    },
    dynamoConfig: {
        region: 'us-east-1'
    },
    table: 'demo-back-e2e'
}

const ciConfig = {
    endpoint: process.env.E2E_URL,
    puppeteerConfig: {},
    dynamoConfig: {
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET
        }
    },
    table: 'demo-back-e2e'
}

const CONFIG = process.env.LOCAL ? localConfig : ciConfig




// * * * * * * * * * * * * * * * * * * * * * * * * * 
// DATABASE RESET
// * * * * * * * * * * * * * * * * * * * * * * * * * 
const getAllSubmissions = async (db) => {
    const params = {
        TableName: CONFIG.table,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'submissions',
            ':sk': 'sub_'
        }
    }
    const all = await db.query(params).promise()
    return all.Items
}

const removeSumbission = async (db, sk) => {
    const params = {
        TableName: CONFIG.table,
        Key: {
            PK: 'submissions',
            SK: sk
        }
    }
    await db.delete(params).promise()
}

const resetDatabase = async () => {
    const AWS = require('aws-sdk')
    const db = new AWS.DynamoDB.DocumentClient(CONFIG.dynamoConfig)
    const items = await getAllSubmissions(db)
    for (const item of items) {
        await removeSumbission(db, item.SK)
    }
}




// * * * * * * * * * * * * * * * * * * * * * * * * * 
// E2E Test
// * * * * * * * * * * * * * * * * * * * * * * * * * 
jest.setTimeout(30000)
const getText = async (page, sel) => await page.$eval(sel, el => el.textContent.trim())

describe('main-e2e', () => {
    test('test', async () => {
        const browser = await puppeteer.launch(CONFIG.puppeteerConfig);
        try {
            // Load page
            const page = await browser.newPage();
            await page.goto(CONFIG.endpoint);
            await page.setViewport({ width: 1200, height: 800 });
            await page.waitForSelector('#text-input');


            // Fill out form
            await page.type('#text-input', 'Comment I am submitting');

            await page.click('#submit-button');
            await page.waitForSelector('.item');

            // Confirm item has been added
            const text = await getText(page, '.item')
            expect(text).toBe('Comment I am submitting')

        } finally {
            await browser.close();
        }
    })
})

afterAll(async () => {
    await resetDatabase()
})