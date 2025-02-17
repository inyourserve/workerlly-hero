import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  children?: React.ReactNode
  className?: string
}

interface PaginationContentProps {
  children: React.ReactNode
  className?: string
}

interface PaginationItemProps {
  className?: string
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

interface PaginationLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

interface PaginationPreviousProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

interface PaginationNextProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const Pagination = ({ children, className }: PaginationProps) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={`mx-auto flex w-full justify-center ${className ?? ''}`}
    >
      {children}
    </nav>
  )
}

const PaginationContent = ({
  children,
  className,
}: PaginationContentProps) => {
  return (
    <div className={`flex flex-row items-center gap-1 ${className ?? ''}`}>
      {children}
    </div>
  )
}

const PaginationItem = ({
  className,
  children,
}: PaginationItemProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const PaginationLink = ({
  className,
  isActive,
  size = "default",
  children,
  onClick,
  disabled,
  ...props
}: PaginationLinkProps) => {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      className={className}
      onClick={onClick}
      disabled={disabled}
      variant={isActive ? "default" : "outline"}
      size={size}
      {...props}
    >
      {children}
    </Button>
  )
}

const PaginationPrevious = ({
  children,
  onClick,
  disabled,
  className,
}: PaginationPreviousProps) => {
  return (
    <PaginationLink
      size="default"
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 pl-2.5 ${className ?? ''}`}
    >
      <ChevronLeft className="h-4 w-4" />
      {children || <span>Previous</span>}
    </PaginationLink>
  )
}

const PaginationNext = ({
  children,
  onClick,
  disabled,
  className,
}: PaginationNextProps) => {
  return (
    <PaginationLink
      size="default"
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 pr-2.5 ${className ?? ''}`}
    >
      {children || <span>Next</span>}
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

Pagination.Content = PaginationContent
Pagination.Item = PaginationItem
Pagination.Link = PaginationLink
Pagination.Previous = PaginationPrevious
Pagination.Next = PaginationNext

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}