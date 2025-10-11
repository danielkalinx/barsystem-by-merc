'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '32rem',
              width: '100%',
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#dc2626',
              }}
            >
              Ein schwerwiegender Fehler ist aufgetreten
            </h2>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Es tut uns leid, aber etwas ist schiefgelaufen. Bitte lade die Seite neu.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.375rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#6b7280',
                    wordBreak: 'break-all',
                  }}
                >
                  {error.message}
                </p>
                {error.digest && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#6b7280',
                      marginTop: '0.5rem',
                    }}
                  >
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Erneut versuchen
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Seite neu laden
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
