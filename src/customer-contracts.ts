import { ElementHandle, Page } from "puppeteer";

export async function waitForLoadBar(page: Page)
{
    await page.waitForSelector('[id="loadBarAjaxVraptor"][style="display: block;"]', { timeout: 5000 }).catch(_ => {})
    await page.waitForSelector('[id="loadBarAjaxVraptor"][style="display: none;"]')
}

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

    const contracts: any[] = []
    for (var i = 1; i < rows.length; i++) {
        if (i > 1) {
            // Abre aba contratos
            await page.evaluate(() => {
                // @ts-ignore
                document.querySelector('[id="mainFormMenu:agreements"]')?.click()
            })
            await waitForLoadBar(page)
        }

        // Coleta dados do contrato
        const contractElement = await page.$(`.portletBox td > table > tbody .rich-table-row:nth-child(${i}) td:nth-child(2) a`) as ElementHandle
        const idElement = await page.$(`.portletBox td > table > tbody .rich-table-row:nth-child(${i}) td:nth-child(4)`) as ElementHandle
        const nameElement = await page.$(`.portletBox td > table > tbody .rich-table-row:nth-child(${i}) td:nth-child(5)`) as ElementHandle

        const contract = await page.evaluate(element => element.textContent, contractElement) as string
        const id = await page.evaluate(element => element.textContent, idElement) as string
        const name = await page.evaluate(element => element.textContent, nameElement) as string

        // Abre contrato
        await contractElement.click()

        await waitForLoadBar(page)

        // Aba de faturamento 
        await page.evaluate(() => {
            // @ts-ignore
            document.querySelector('[id="mainFormMenu:allBillsMenu"]')?.click()
        })
        
        await waitForLoadBar(page)

        // Coleta preço
        const priceElement = await page.$('.rich-table-row td:nth-child(6)') as ElementHandle
        const price = await page.evaluate(e => e.textContent, priceElement)

        // Aba de serviços ativos
        await page.evaluate(() => {
            // @ts-ignore
            document.querySelector('#nav360 > li:nth-child(2) > ul > li:nth-child(2) a')?.click()
        })

        await new Promise(r => setTimeout(r, 1000))
        
        const aditionalsElements = Array.from(await page.$$('.rich-table-row td:nth-child(2)'))
        const aditionals = await Promise.all(aditionalsElements.map(async (e) => await page.evaluate(e => e.textContent, e)))
        contracts.push({ contract, id, name, index: i, price, aditionals,  })
    }

    return contracts
}