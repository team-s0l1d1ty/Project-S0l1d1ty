import * as fs from 'fs'

export function writeEnvVar(dotenv: string) {
  const directory = `${process.cwd()}/Account-assets`
  fs.rmSync(directory, { recursive: true, force: true })
  fs.mkdirSync(directory)
  fs.writeFileSync(`${directory}/.env`, dotenv, 'utf-8')
  return true
  }

export function appendEnvVar(dotenv: string) {
  const directory = `${process.cwd()}/Account-assets`
  //fs.rmSync(directory, { recursive: true, force: true })
  //fs.mkdirSync(directory)
  fs.appendFileSync(`${directory}/.env`, dotenv, 'utf-8')
  return true
  }