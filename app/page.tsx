import { redirect } from 'next/navigation'

export default async function App() {
  redirect('/signin')
  return (
    <div>
      hi from krishna
    </div>
  )
}
