import Server from './server';
import config from './config'

process.title = config.PROCESS_TITLE || 'nsp_payment_example'

const server = new Server();
server.start()







