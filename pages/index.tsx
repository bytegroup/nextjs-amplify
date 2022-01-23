/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import useSWR from 'swr'
import styles from '@/pages/index.module.css'
import { GetServerSideProps } from 'next'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

interface Geo {
  lat: string
  lng: string
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}

interface SettingsType {
  id: number
  key: string
  value: string
}

interface ssData {
  endpoint: string
  email: string
  password: string
  valueEndpoint: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function Home({ ssData }: { ssData: ssData }) {
  const ranNumber = Math.random()
  const [appSettings, setAppSettings] = useState([])
  const { data, error } = useSWR(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  )
  useEffect(() => {
    axios
      .post(`${ssData.valueEndpoint}/users`, {
        firstName: 'mustak',
        lastName: 'san',
        email: `mustak_${ranNumber}@gfh.com`,
        password: `mustak10000000_${ranNumber}`,
        confirmedPassword: `mustak10000000_${ranNumber}`,
        role: 'ADMIN',
      })
      .catch((error) => {
        console.log('Error in seperate error block', error)
      })
      .finally(async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: AxiosResponse<any, any> = await axios.post(
            `${ssData.valueEndpoint}/auth/login`,
            {
              email: `mustak_${ranNumber}@gfh.com`,
              password: `mustak10000000_${ranNumber}`,
            }
          )
          await fetchAppSettings(result)
        } catch (error) {
          console.log('error', error)
        }
      })
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let valueApiError: any
  /***
   * IMP:
   * Please increase server env var for token expiration period
   */
  const fetchAppSettings = async (result: any): Promise<void> => {
    const data = await axios.get(`${ssData.valueEndpoint}/app-settings`, {
      headers: { Authorization: 'Bearer ' + result?.data?.access_token },
    })
    console.log('After fetcher:', data.data)
    setAppSettings(data.data)
    console.log({ appSettings }, { valueApiError })
  }
  const envVar = process.env.NEXT_PUBLIC_BROWSER_ENV_VARIABLE
  return (
    <div className={styles.container}>
      <Head>
        <title>VALUE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Landing page</h1>
        {error && <div>failed to load</div>}
        {!data && <div>loading...</div>}
        {data && data.length && (
          <>
            <h2>Users from JsonPlaceholder</h2>
            <div>
              {data.map((user: User) => (
                <div key={user.id}>{user.name}</div>
              ))}
            </div>
          </>
        )}
        <br />
        <h2>ENV Variable - {envVar}</h2>
        <br />
        {ssData && (
          <>
            <h2>ENV from SSR</h2>
            <div>Email - {ssData.email}</div>
            <div>Password - {ssData.password}</div>
          </>
        )}
        <h2>App Settings</h2>
        {valueApiError && <div>failed to load</div>}
        {!appSettings && <div>loading...</div>}
        {appSettings && appSettings.length && (
          <>
            <h3>Key-values are:</h3>
            <div>
              {appSettings.map((settings: SettingsType) => (
                <div key={settings.id}>
                  {' '}
                  {settings.key} : {settings.value}
                </div>
              ))}
            </div>
          </>
        )}
        <br />
      </main>

      <footer className={styles.footer}>
        <p>Powered by Toggle</p>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const ssData = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    valueEndpoint: process.env.VALUE_API_URL,
  }
  return {
    props: { ssData }, // will be passed to the page component as props
  }
}
