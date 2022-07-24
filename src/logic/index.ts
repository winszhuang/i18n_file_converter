import xlsx, { WorkSheet } from 'node-xlsx'
import { readDirByPath, writeFile, getDesktopPath } from './helper';
import { setTableHeaderByLangList, transToWorksheet } from './strategy/jsonToExcel';

export async function jsonToExcel(
  langList: string[],
  mainLang: string,
  folderPath: string
) {
  const tableHeader = setTableHeaderByLangList(langList)

  const workSheetList: WorkSheet<string>[] = []
  const jsonFileList = await readDirByPath(`${folderPath}/${mainLang}`)
  if (!jsonFileList) {
    alert(`folder ${folderPath}/${mainLang} does not have any json files`)
    return 
  }

  for (const fileName of jsonFileList) {
    const workSheetItem = await transToWorksheet({
      fileName, 
      i18nFolderPath: folderPath, 
      tableHeader,
      mainLang
    })
    workSheetList.push(workSheetItem)
  }

  const buffer = xlsx.build(workSheetList);

  const newFilePath = `${getDesktopPath()}/export.xlsx`

  return await writeFile(newFilePath, buffer)
}

export async function excelToJson() {
  console.log('excelToJson');
}

