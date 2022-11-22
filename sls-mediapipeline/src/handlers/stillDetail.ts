interface Params {
  filename: string
}
interface Response {
  bucket: string
  stillKeys: string[]
}

const main = async (params: Params): Promise<Response> => {
  let bucket = ''
  const stillKeys: string[] = []

  if (!params.filename) {
    return emptyResponse
  }
  try {
    const parts = params.filename.split('/')
    bucket = parts[2]
    const basename = parts.slice(-1)[0]

    const matches = basename.match(/^(.+\.)(\d+)(\..+)$/)
    if (!matches) {
      return emptyResponse
    }
    const basenamePrefix = matches[1]
    const basenameCounter = parseInt(matches[2])
    const basenameSuffix = matches[3]

    const prefix = `${parts.slice(3, -1).join('/')}/`

    for (let i = 0; i <= basenameCounter; i++) {
      const stillKey = [prefix, basenamePrefix, `0000000${i}`.slice(-7), basenameSuffix].join('')
      stillKeys.push(stillKey)
    }
    return {
      bucket,
      stillKeys,
    }
  } catch {
    return emptyResponse
  }
}

export const handler = main

const emptyResponse: Response = {
  bucket: '',
  stillKeys: [],
}
