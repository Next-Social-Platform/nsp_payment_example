import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import * as path from 'path'
import { createConnection, createConnections } from 'typeorm'
import routes from './routes'

class Server {
  public app: express.Application
  protected server: http.Server
  public port: string | number

  constructor() {
    this.port = process.env.PORT || 30000
    this.app = express()
    this.server = http.createServer(this.app)

    this.initDB()
    this.initializeRoutes()
    this.initializeDefaultRouter()
  }

  private initDB(): void {
    console.debug('env:', process.env.NODE_ENV)
    console.debug('env:', process.env.DB_HOST)

    createConnections([
      {
        name: 'default',
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        entities: [__dirname + '/entities/*'],
        synchronize: true,
        logging: process.env.SQL_DEBUG === 'true',
        extra: {
          bigNumberStrings: false,
          supportBigNumbers: true,
        },
      }
    ])
      .then((connection) => {
        // here you can start to work with your entities
        console.debug('db connected:')
      })
      .catch((error) => console.debug(error))
  }


  private initializeMiddlewares(): void {
    //express setting
    this.app.use((req, res, next) => {
      res.removeHeader('X-Powered-By')
      next()
    })

    this.app.use(helmet({ contentSecurityPolicy: false }))

    if (process.env.NODE_ENV === 'production') {
      this.app.use(
        cors((req, callback) => {
          let corsOption = {}
          const origin = req.headers.origin

          if (origin) {
            corsOption = {
              origin: origin,
              credentials: true,
            }
          } else {
            corsOption = {
              origin: true,
            }
          }

          callback(null, corsOption)
        })
      )
    } else {
      this.app.use(
        cors((req, callback) => {
          let corsOption = {}
          const origin = req.headers.origin

          if (origin) {
            corsOption = {
              origin: origin,
              credentials: true,
            }
          } else {
            corsOption = {
              origin: true,
            }
          }

          callback(null, corsOption)
        })
      )
    }

    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    this.app.use(cookieParser())
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes)
  }

  private initializeDefaultRouter() {
    //default fallback
    this.app.use('*', (req, res) => {
      res.status(404).send({ message: 'хуудас олдсонгүй' })
    })
  }

  public start(): void {
    this.server.listen(this.port)
    this.server.on('error', this.onError)
    this.server.on('listening', this.onListening)
  }

  private onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
      throw error
    }
    switch (error.code) {
      case 'EACCES':
        console.error(`${this.port} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(`${this.port} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  }

  private onListening = (): void => {
    console.log(`Listening on ${this.port}`)
  }
}

export default Server
