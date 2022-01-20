import Head from 'next/head'
import { FC } from 'react'

interface MetaProps {
  title: string
  keywords?: string
  description?: string
}

const Meta: FC<MetaProps> = ({ title, keywords, description }) => {
  return (
    <Head>
      <title data-testid="title">{title}</title>
      <meta name="keywords" content={keywords} data-testid="keywords" />
      <meta
        name="description"
        content={description}
        data-testid="description"
      />
      <link rel="icon" href="/favicon.ico" data-testid="favicon" />
    </Head>
  )
}

Meta.defaultProps = {
  keywords: '',
  description: '',
}

export default Meta
