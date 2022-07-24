import fs from 'fs'
import { getJsonByPath, flattenJSON } from '../helper'

export function setTableHeaderByLangList(langList: string[]) {
  return ['Key'].concat(langList);
}

export async function transToWorksheet(
  filePath: fs.PathLike,
  folderPath: fs.PathLike,
  tableHeader: string[],
  mainLang: string
) {
  const langListWithoutEn = tableHeader.filter(name => name !== 'Key' && name !== mainLang)

  const allKeyJson = {}

  for (const currLangName of langListWithoutEn) {
      const path = `${folderPath}/${currLangName}/${filePath}`
      const jsonContent = await getJsonByPath(path)

      if (jsonContent) {
          Object.assign(allKeyJson, jsonContent)
      }
  }

  const path = `${folderPath}/${mainLang}/${filePath}`
  const enJsonContent = await getJsonByPath(path)

  Object.assign(allKeyJson, enJsonContent)

  // 攤平所有nested屬性
  const flattenJson = flattenJSON(allKeyJson)

  const data = Object.entries(flattenJson).map(([key, value]) => [key, value])
  const workSheetItem = [['Key', 'English'], ['印彩-Menu', '備註 : 如果下面字彙顯示非英文語系，表示該英文內容不存在'], ...data]

  return {
      name: (filePath as string).replace('.json', ''),
      data: workSheetItem,
      options: {}
  }
}