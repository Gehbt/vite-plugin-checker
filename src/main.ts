// import ts from 'typescript'
import { Plugin } from 'vite'
import { tscProcess } from './cliMode'
import { diagnose } from './apiMode'

interface PluginOptions {
  /**
   * Whether to use vue-tsc to check .vue file.
   * @default !!import('vue-tsc')
   */
  vueTsc?: boolean
  /**
   *
   */
  displayMode?: 'spawn' | 'exec'
  /**
   *
   */
  errorOverlay?: boolean
  /**
   *
   */
  mode?: 'cli' | 'api'
}

export function plugin(userOptions?: PluginOptions): Plugin {
  let hasVueTsc = false
  try {
    require.resolve('vue-tsc')
    hasVueTsc = true
  } catch {}

  const mode = userOptions?.mode || 'api'

  return {
    name: 'fork-ts-checker',
    config: (config) => {
      if (mode === 'cli') {
        tscProcess.config(config)
      } else {
        // diagnose.config(config)
      }
    },
    configureServer(server) {
      if (mode === 'cli') {
        tscProcess.configureServer(server)
      } else {
        diagnose.configureServer(server)
      }

      return () => {
        server.middlewares.use((req, res, next) => {
          next()
        })
      }
    },
  }
}