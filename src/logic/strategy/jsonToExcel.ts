import fs from 'fs'
import { getJsonByPath, flattenJSON } from '../helper'

interface TransData {
  /** fileName with .json suffix, e.g. "common.json"*/
  fileName: string,
  /** e.g. "C:\Users\test\Desktop\i18n". this folder must contain a folder for each language */
  i18nFolderPath: fs.PathLike,
  /** e.g "['key', 'en', 'zh-tw']"" */
  tableHeader: string[],
  mainLang: string
}

export function setTableHeaderByLangList(langList: string[]) {
  return ['Key'].concat(langList);
}

export async function transToWorksheet(transData: TransData) {
  const allKeyJson = await getAllKeyJson(transData)

  // 攤平所有nested屬性
  const flattenJson = flattenJSON(allKeyJson)

  const data = Object.entries(flattenJson).map(([key, value]) => [key, value])
  const workSheetItem = [['Key', 'English', ], ['印彩-Menu', '備註 : 如果下面字彙顯示非英文語系，表示該英文內容不存在'], ...data]

  return {
      name: (transData.fileName as string).replace('.json', ''),
      data: workSheetItem,
      options: {}
  }
}

async function getAllKeyJson(
  {
    fileName,
    i18nFolderPath,
    tableHeader,
    mainLang
  }: TransData
) {
  const langListWithoutMainLang = tableHeader.filter(name => name !== 'Key' && name !== mainLang)

  const allKeyJson = {}

  for (const currLangName of langListWithoutMainLang) {
      const path = `${i18nFolderPath}/${currLangName}/${fileName}`
      const jsonContent = await getJsonByPath(path)

      if (jsonContent) {
          Object.assign(allKeyJson, jsonContent)
      }
  }

  const path = `${i18nFolderPath}/${mainLang}/${fileName}`
  const enJsonContent = await getJsonByPath(path)

  Object.assign(allKeyJson, enJsonContent)

  return allKeyJson
}