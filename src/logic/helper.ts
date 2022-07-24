import fs from 'fs'
import os from 'os'
import path from 'path'

const errorMessageList: string[] = []

// https://www.tutorialspoint.com/flattening-a-json-object-in-javascript
export function flattenJSON(obj: Record<string, any> = {}, res: Record<string, any> = {}, extraKey = '') {
    for(const key in obj){
       if(typeof obj[key] !== 'object'){
          res[extraKey + key] = obj[key];
       }else{
          flattenJSON(obj[key], res, `${extraKey}${key}.`);
       };
    };
    return res;
 };

export function getDesktopPath() {
  return path.join(os.homedir(), "Desktop")
}

export async function isPathExist(path: fs.PathLike): Promise<true | NodeJS.ErrnoException['message']> {
  return new Promise((resolve) => {
    fs.access(path, (err) => resolve(!err ? true : err.message))
  })
}

export async function readDirByPath(path: fs.PathLike): Promise<string[] | null> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                console.warn(err.message);
                resolve(null)
            } else {
                resolve(data)
            }
        })
    })
}

export async function readFileByPath(path: fs.PathLike): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.error(err.message);
                errorMessageList.push(err.message)
                return resolve(null)
            }
            resolve(data)
        })
    })
}

export async function getLangListByFolderPath(path: fs.PathLike) {
    const data = await readDirByPath(path)

    return data 
      ? data.filter(item => !item.includes('.js')) 
      : []
}

export async function getJsonByPath(path: fs.PathLike): Promise<object | null> {
  const bufferContent = await readFileByPath(path)

  return bufferContent 
      ? JSON.parse(bufferContent.toString())
      : null
}

export async function writeFile(newFilePath: fs.PathLike, buffer: Buffer) {
    return new Promise((resolve) => {
        fs.writeFile(newFilePath, buffer, (err) => {
            if (err) {
                console.error(err.message);
                errorMessageList.push(err.message)
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}