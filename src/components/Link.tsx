import { Link as RouterLink } from 'react-router-dom'

interface LinkProps {
  linkTo: string
  isExternal?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

export const Link = ({ linkTo, isExternal = false, className, onClick, children }: LinkProps) => {
  if (isExternal) {
    return (
      <a href={linkTo} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={linkTo} className={className} onClick={onClick}>
      {children}
    </RouterLink>
  )
}
