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

const CUT_LANG_SYMBOL = '♡✓♡'
const languageIdentifier = (lang: string) => `☑${lang}⚇☒`
const getLangFromLanguageIdentifier = (text: string) => text.split('⚇☒')[0].split('☑')[1]
const getValueFromLanguageIdentifier = (text: string) => text.split('⚇☒').pop()!

export function setTableHeaderByLangList(langList: string[]) {
  return ['Key'].concat(langList);
}

export async function transToWorksheet(transData: TransData) {
  const combinedJson = await combinedValueJson(transData)

  const data = Object.entries(combinedJson).map(([key, value]) => {
    const allLangString = value.split(CUT_LANG_SYMBOL)
    const langDataMap = allLangString.reduce((newObj, langString) => {
      const lang = getLangFromLanguageIdentifier(langString)
      const value = getValueFromLanguageIdentifier(langString)

      newObj[lang] = value
      
      return newObj
    }, {} as Record<string, string>)

    return transData.tableHeader.map(langName => {
      if (langName === 'Key') return key
      return langDataMap[langName as keyof typeof langDataMap] || ''
    })
  })

  const workSheetItem = [transData.tableHeader, ['印彩-Menu', '備註 : 如果下面字彙顯示非英文語系，表示該英文內容不存在'], ...data]

  return {
      name: (transData.fileName as string).replace('.json', ''),
      data: workSheetItem,
      options: {}
  }
}

/** 
 * 合併各語系json的各欄位的value值
 * e.g.
 * en : { account: Account }
 * zh-tw: { account: 帳戶 }
 * 
 * 合併後 :
 * { account: ☑$en☒Account♡✓♡☑$zh-tw☒帳戶}
 * 可靠特殊字串分割取得各自語系內容
 */
async function combinedValueJson(
  {
    fileName,
    i18nFolderPath,
    tableHeader,
    mainLang
  }: TransData
) {
  const langList = tableHeader.filter(name => name !== 'Key')

  const combinedJson: Record<string, string> = {}

  for (const currLangName of langList) {
    const path = `${i18nFolderPath}/${currLangName}/${fileName}`
    const jsonContent = await getJsonByPath(path)

    if (!jsonContent) {
      console.warn(`${currLangName} language didn't have ${fileName} file`);
      continue
    }

    const flattenJson = flattenJSON(jsonContent)
    for (const [key, value] of Object.entries(flattenJson)) {
      if (combinedJson[key]) {
        combinedJson[key] += `${CUT_LANG_SYMBOL}${languageIdentifier(currLangName)}${value}`
      } else {
        combinedJson[key] = `${languageIdentifier(currLangName)}${value}`
      }
    }
  }

  return combinedJson
}