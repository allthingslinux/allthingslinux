import Welcome from '@/markdown/1-19-24.mdx'
 
function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}
 
const overrideComponents = {
  h1: CustomH1,
}
 
export default function Page() {
  return <Welcome components={overrideComponents} />
}