'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import JsonLd from './JsonLd'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Beranda', href: '/' }, ...items]

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://kemenham-kalsel.go.id${item.href}` : undefined,
    })),
  }

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1
            return (
              <li key={idx} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                {idx > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
                {idx === 0 && <Home size={14} className="breadcrumb-home-icon" />}
                {item.href && !isLast ? (
                  <Link href={item.href} className="breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
