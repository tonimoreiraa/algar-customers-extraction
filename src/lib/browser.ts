import puppeteer, { Browser, Cookie, Page } from 'puppeteer';
import 'dotenv/config'
import { createApi } from './api';
import { AxiosInstance } from 'axios';

export async function initBrowser(): Promise<[Browser, Page, AxiosInstance]>
{
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()

    await page.goto('https://algarcrm.algartelecom.com.br/')
    const username = await page.waitForSelector('#username')
    await username?.type(process.env.ALGARCRM_LOGIN as string)
    const password = await page.waitForSelector('#password')
    await password?.type(process.env.ALGARCRM_PASSWORD as string)
    await page.click('body > main > div > div.ui.segment > div.mt-0 > div > button')
    await page.waitForSelector('#content > nav > form > div > div.navbar-info > span', { timeout: 10*10e4 })
    
    const cookies = await page.cookies()
    const sessionCookie = cookies.find(c => c.name == 'JSESSIONID') as Cookie
    const api = createApi('JSESSIONID=' + sessionCookie.value)

    return [browser, page, api]
}