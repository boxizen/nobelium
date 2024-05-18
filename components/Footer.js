import { useConfig } from '@/lib/config'
// import Vercel from '@/components/Vercel'
const Footer = ({ fullWidth }) => {
  const BLOG = useConfig()

  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since
  return (
    <div
      className={`mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
      }`}
    >
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="my-4 text-xs leading-6">
        <div className="flex align-baseline justify-center flex-wrap">
          <p>
            © {BLOG.title} {y}
          </p>
          <p className="mx-1">·</p>
          <p>Powered by <a className="underline" style={{ color: '#020617 '}} href="https://vercel.com/">Vercel</a></p>
        </div>
      </div>
    </div>
  )
}

export default Footer
