interface Params {
  filename: string
}
const main = async (params: Params): Promise<string> => {
  if (!params.filename) {
    return ''
  }
  try {
    return params.filename
      .split('/')
      .slice(-1)[0]
      .split('.')
      .slice(0, -1)
      .join(' ')
      .toLowerCase()
      .replace(/[^0-9a-z-]/g, ' ')
      .replace(/  +/g, ' ')
      .split(' ')
      .map((el) => {
        return el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()
      })
      .join(' ')
  } catch {
    return params.filename
  }
}

export const handler = main
