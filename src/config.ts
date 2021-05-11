import * as dotenv from 'dotenv'
import * as path from 'path'

const envPath = path.resolve(__dirname, '../.env')

const load = () => {
  const result = dotenv.config({ path: envPath, debug: true })
  console.log('result', result)
  return result.parsed || {}
}

const config = load()

export default config
