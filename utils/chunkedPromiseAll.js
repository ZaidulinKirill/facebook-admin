import splitByChunks from 'lodash.chunk'

export const chunkedPromiseAll = async (promises, concurrency = 5) => {
  const chunks = splitByChunks(promises, concurrency)
  const results = []
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index]
    // eslint-disable-next-line no-await-in-loop
    results.push(...await Promise.all(chunk.map(f => f())))
  }

  return results
}
