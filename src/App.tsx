import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { DocsIndexPage, DocsSlugPage } from './pages/DocsPage'
import { ChangelogPage } from './pages/ChangelogPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { GITHUB_URL } from './lib/github'

function GitHubRedirect() {
  useEffect(() => {
    window.location.replace(GITHUB_URL)
  }, [])

  return (
    <p className="p-8 text-center text-sm text-text-muted">
      Redirecting to{' '}
      <a href={GITHUB_URL} className="text-accent underline-offset-2 hover:underline">
        GitHub
      </a>
      …
    </p>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="docs" element={<DocsIndexPage />} />
          <Route path="docs/:slug" element={<DocsSlugPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
          <Route path="github" element={<GitHubRedirect />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
