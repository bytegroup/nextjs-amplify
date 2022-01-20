import Meta from './Meta'

interface ChildProps {
  title: string
  keywords?: string
  description?: string
  children: React.ReactNode
}

const Layout: React.FC<ChildProps> = ({
  title,
  keywords,
  description,
  children,
}: ChildProps) => {
  return (
    <div>
      <Meta title={title} keywords={keywords} description={description} />
      {children}
    </div>
  )
}

Layout.defaultProps = {
  title: '',
  description: '',
  keywords: '',
}

export default Layout
