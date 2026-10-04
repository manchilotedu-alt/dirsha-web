export const metadata = {
  title: 'ድርሻ - Dirsha Sales System',
  description: 'የሽያጭና ኮሚሽን መከታተያ ሲስተም',
}

export default function RootLayout({ children }) {
  return (
    <html lang="am">
      <body style={{ margin: 0, padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8' }}>
        {children}
      </body>
    </html>
  )
}
