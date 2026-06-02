import { Link as RouterLink } from 'react-router-dom'

interface LinkProps {
  linkTo: string
  isExternal?: boolean
  className?: string
  children: React.ReactNode
}

export const Link = ({ linkTo, isExternal = false, className, children }: LinkProps) => {
  if (isExternal) {
    return (
      <a href={linkTo} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={linkTo} className={className}>
      {children}
    </RouterLink>
  )
}
