import xlsx from 'node-xlsx'
import { readFile } from 'fs/promises'

export async function getCustomersList(): Promise<string[]>
{
    const content = await readFile('./datagrid.xlsx')
    const document = xlsx.parse(content, { })
    const customers = document[0].data.slice(1).map(row => row[1])
    return customers
}