import DOMPurify from 'isomorphic-dompurify'
import { readFileSync, writeFileSync, promises as fsPromises, appendFileSync } from 'fs'
import { join } from 'path'

export async function asyncWriteFile(filename: string, data: any, flag: string) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    try {
      await fsPromises.writeFile(join(__dirname, filename), data, {
        flag: flag,
      });
  
      const contents = await fsPromises.readFile(
        join(__dirname, filename),
        'utf-8',
      );
  
      return contents;
    } catch (err) {
      console.log(err);
      return 'Something went wrong';
    }
  }

export async function asyncReadFile(filename: string) {
    try {
      const contents = await fsPromises.readFile(
        join(__dirname, filename),
        'utf-8',
      );

      return contents;
    } catch (err) {
      console.log(err);
      return 'Something went wrong';
    }
  }

  export async function makeTable(fileName:string,tableName:string){
    try {
      let data = await asyncReadFile(fileName)
      let lines = data.split(/\r?\n/)
      let table = '<table class="center">\n' 
      table += `<tr><th>${tableName}</th></tr>\n`
      lines.forEach(line => 
        {
          try{
            let clean:string = DOMPurify.sanitize(line)
            //console.log(clean)
            table += `<tr><td><p>${clean}</p></td></tr>\n`
          }catch(err){
            console.log(err)
          }
        })
      table += '</table>'
      return table
    }catch(err){
      console.log(err)
      return 'something went wrong'
    }    
  }