interface Params {
  id: string
  filename: string
}
interface Response {
  bucket: string
  key: string
  rendId: string
}

const main = async (params: Params): Promise<Response> => {
  let bucket = ''
  let key = ''
  let rendId = '0000'
  if (!params.filename) {
    return {
      bucket,
      key,
      rendId,
    }
  }
  try {
    const parts = params.filename.split('/')
    bucket = parts[2]
    key = parts.slice(3).join('/')
    const basename = parts.slice(-1)[0].split('.')[0]
    const matches = basename.match(/^.*-(\d+)p$/)
    if (matches) {
      rendId = `0000${matches[1]}`.slice(-4)
    }
  } catch {}
  return {
    bucket,
    key,
    rendId,
  }
}

export const handler = main
