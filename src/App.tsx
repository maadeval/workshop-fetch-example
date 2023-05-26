import { useEffect, useState } from 'react'

const BASE_URL = 'https://api.github.com/repos'
const PERSONAL_ACCESS_TOKEN = import.meta.env.VITE_PERSONAL_ACCESS_TOKEN

const organizacion = 'maadeval'
const name = 'madeval'

const url = `${BASE_URL}/${organizacion}/${name}`

class InvalidRepositoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRepositoryError'
  }
}

function App() {
  const [repositoryData, setRepositoryData] = useState({})
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const abortController = new AbortController()

    fetch(url, {
      signal: abortController.signal,
      headers: {
        Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new InvalidRepositoryError('Invalid reponse')
        return res.json()
      })
      .then((data) => {
        setRepositoryData(data)
      })
      .catch((err) => {
        if (err instanceof InvalidRepositoryError)
          return setError(
            'El repositorio que está cargando no se encuentra dentro de Github.'
          )
      })

    return () => abortController.abort()
  }, [])

  if (error) return <p>{error}</p>

  return (
    <>
      {import.meta.env.MODE !== 'production' && (
        <pre
          style={{
            maxHeight: '200px',
            position: 'fixed',
            right: '0',
            bottom: '0',
            overflow: 'auto',
            backgroundColor: '#17171720',
          }}
        >
          <code>{JSON.stringify(repositoryData, null, 2)}</code>
        </pre>
      )}
      <h1>Repo information:</h1>
      <h3>{repositoryData.name}</h3>
      <p>{repositoryData.description}</p>
      <a href={repositoryData.html_url} target='_blank'>
        Link del repositorio en Github
      </a>
    </>
  )
}

export default App
