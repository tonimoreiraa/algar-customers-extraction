import xlsx from 'node-xlsx'
import { readFile } from 'fs/promises'

export async function getCustomersList(file: string): Promise<string[]>
{
    const content = await readFile(file)
    const document = xlsx.parse(content, { })
    const customers = document[0].data.slice(1)
        .reduce((acc: any, row: any) => {
            if (acc.indexOf(row[1]) == -1) {
                acc.push(row[1])
            }
            return acc
        }, [])
    console.log(document[0].data.length, customers.length)
    return customers
}