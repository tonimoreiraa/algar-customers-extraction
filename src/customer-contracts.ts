import { ElementHandle, Page } from "puppeteer";

export async function getCustomerContracts(customerDoc: string, page: Page)
{
    await page.goto('https://atendimento360.algartelecom.com.br/fff7a7169e5')
    const input = await page.waitForSelector('.numeric[maxlength="14"]') as ElementHandle
    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector('.numeric[maxlength="14"]').value = ''
    })
    await input.type(customerDoc)
    await page.click('#blocoSalvar a')

    await page.waitForSelector('#nav360 > li:nth-child(2) > ul > li:nth-child(1) a', {timeout: 10000})
    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector('#nav360 > li:nth-child(2) > ul > li:nth-child(1) a').click()
    })
    await page.waitForSelector('.portletBox td > table > tbody .rich-table-row')

    const rows = await page.$$('.portletBox td > table > tbody .rich-table-row')

    const products: {contract: string, id: string, name: string, index: number, price?: number}[] = []
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i]
        const contractElement = await row.$('td:nth-child(2)')
        const idElement = await row.$('td:nth-child(4)')
        const nameElement = await row.$('td:nth-child(5)')

        const contract = await page.evaluate(element => element?.textContent, contractElement) as string
        const id = await page.evaluate(element => element?.textContent, idElement) as string
        const name = await page.evaluate(element => element?.textContent, nameElement) as string

        products.push({ contract, id, name, index: i })
    }

    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector('.rich-table-row a').click()
    })
    await page.waitForSelector('#detailsAssetOnAlagarCRM')
    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector('[id="mainFormMenu:allBillsMenu"]')?.click()
    })
    await page.waitForSelector('.portletBox td > table > tbody .rich-table-row')

    const productsRows = await page.$$('.portletBox td > table > tbody .rich-table-row')
    for (var i = 0; i < products.length; i++) {
        const product = products[i]
        const productRow = productsRows[i]
        const priceElement = await productRow.$('td:nth-child(6)')
        const price = Number(await page.evaluate(e => e?.textContent, priceElement))
        products[i] = { ...product, price }
    }

    return products
}