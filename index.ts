import 'dotenv/config'
import { getCustomerByDocument } from './src/crm-customer'
import { getCustomerContracts } from './src/customer-contracts'
import { initBrowser } from './src/lib/browser'
import { getCustomersList } from './src/get-customers-list'
import xlsx from 'node-xlsx'
import { writeFile } from 'fs/promises'

async function main()
{
    const [browser, page, api] = await initBrowser()

    const rows: any[] = []
    const customers = await getCustomersList()
    console.log(customers)
    for (const customerDoc of customers) {
        try {
            const customer = await getCustomerByDocument(customerDoc, api)
            const customerData = {
                NOME: customer.customer.name,
                ID: customer.customer.id,
                STATUS: customer.customer.status,
                CPF_CNPJ: customer.customer.primaryDocumentNumber,
                EMAIL: customer.customer.email,
                SEGMENTO: customer.data.segment.superSegment.name,
                TELEFONE: customer.contacts[0]?.phone1,
                TELEFONE2: customer.contacts[1]?.phone1,
            }
            if (customerData.STATUS == 'INATIVO') {
                rows.push(customerData)
                continue;
            }
            const contracts = await getCustomerContracts(customerDoc, page)

            for (const contract of contracts) {
                rows.push({
                    ...customerData,
                    produto: contract.name,
                    valor: contract.price,
                    contagem: contract.contagem,
                    adicionais: contract.aditionals.join(', ')
                })
            }

            console.table(rows)
            console.log([Object.keys(rows[0]), ...rows.map(Object.values),])
            const buffer = xlsx.build([{
                name: 'Datagrid',
                data: [Object.keys(rows[0]), ...rows.map(Object.values),],
                options: {}
            },], { sheetOptions: {} })
            await writeFile('./output.xlsx', buffer)
        } catch (e) {
            console.error(e)
        }
    }
    
    await browser.close()
}

main()