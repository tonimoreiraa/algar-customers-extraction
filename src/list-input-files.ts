import { readdir } from 'fs/promises';
import { join, extname, sep } from 'path';

export async function listInputFiles()
{
    const directoryPath = join(__dirname, '../input')
    const files = await readdir(directoryPath)
    const xlsxFiles = files.reduce<string[]>((acc, file) => {
        if (extname(file).toLowerCase() === '.xlsx') {
            acc.push(directoryPath + sep + file)
        }

        return acc;
    }, [])

    return xlsxFiles
}