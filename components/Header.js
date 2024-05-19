import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import useTheme from '@/lib/theme'

const NavBar = ({ isHome }) => {
  const BLOG = useConfig()
  const locale = useLocale()
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: true, external: true },
    { id: 3, name: locale.NAV.SEARCH, to: '/search', show: true }
  ]
  return (
    <div className={`flex-shrink-0 ${isHome ? 'text-xs' : 'text-sm'}`}>
      <ul className="flex flex-row">
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 text-black dark:text-gray-50 nav"
              >
                <Link href={link.to} target={link.external ? '_blank' : null}>{link.name}</Link>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default function Header ({ navBarTitle, fullWidth }) {
  const BLOG = useConfig()
  const { dark } = useTheme()

  // Favicon

  const resolveFavicon = fallback => !fallback && dark ? '/favicon.dark.png' : '/favicon.png'
  const [favicon, _setFavicon] = useState(resolveFavicon())
  const setFavicon = fallback => _setFavicon(resolveFavicon(fallback))

  useEffect(
    () => setFavicon(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dark]
  )

  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const sentinelRef = useRef(/** @type {HTMLDivElement} */ undefined)
  const handler = useCallback(([entry]) => {
    if (useSticky && navRef.current) {
      navRef.current?.classList.toggle('sticky-nav-full', !entry.isIntersecting)
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }, [useSticky])

  useEffect(() => {
    const sentinelEl = sentinelRef.current
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelEl)

    return () => {
      sentinelEl && observer.unobserve(sentinelEl)
    }
  }, [handler, sentinelRef])

  const titleRef = useRef(/** @type {HTMLParagraphElement} */ undefined)

  function handleClickHeader (/** @type {MouseEvent} */ ev) {
    if (![navRef.current, titleRef.current].includes(ev.target)) return

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinelRef}></div>
      <div
        className={`sticky-nav group m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id="sticky-nav"
        ref={navRef}
        onClick={handleClickHeader}
      >
        <svg
          viewBox="0 0 24 24"
          className="caret w-6 h-6 absolute inset-x-0 bottom-0 mx-auto pointer-events-none opacity-30 group-hover:opacity-100 transition duration-100"
        >
          <path
            d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"
            className="fill-black dark:fill-white"
          />
        </svg>
        <div className="flex items-center">
          <Link href="/" aria-label={BLOG.title}>
            <Image
              src={favicon}
              width={24}
              height={24}
              alt={BLOG.title}
              onError={() => setFavicon(true)}
            />
          </Link>
          <HeaderName
            ref={titleRef}
            siteTitle={BLOG.title}
            siteDescription={BLOG.description}
            postTitle={navBarTitle}
            onClick={handleClickHeader}
          />
        </div>
        <NavBar />
      </div>
    </>
  )
}

function invokeWechat() {
  const chatUrl = 'weixin://';
  if(/ipad|iphone|mac/i.test(navigator.userAgent)) {
    const ifr = document.createElement('iframe');
    ifr.src = chatUrl;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
  } else {
    window.location.href = chatUrl;
  }
}

export function HomeHeader() {
  const BLOG = useConfig()
  const { dark } = useTheme()
  const resolveFavicon = fallback => !fallback && dark ? '/favicon.dark.png' : '/favicon.png'
  const [favicon, _setFavicon] = useState(resolveFavicon())
  const setFavicon = fallback => _setFavicon(resolveFavicon(fallback))

  return (
    <>
      <div className="observer-element flex h-12 items-center px-5 justify-between">
        <div className="flex items-center">
          <Link href="/" aria-label={BLOG.title} className="flex justify-start align-items">
            <Image
              className="mr-2"
              src={favicon}
              width={24}
              height={24}
              alt={BLOG.title}
              onError={() => setFavicon(true)}
            />            
          </Link>
        </div>
        <NavBar isHome />
      </div>      
      <hr className="border-gray-200 dark:border-gray-600 mb-4" />
      <div className="self-center px-4 w-full max-w-3xl">
        <Image
          className="mr-2 my-3"
          src={favicon}
          width={90}
          height={90}
          alt={BLOG.title}
          onError={() => setFavicon(true)}
        />        
        <div className="text-4xl slogan mb-2">{BLOG.author}</div>
        <div className="flex mb-6">
          <a href="https://github.com/boxizen" className="mr-2" target="_blank">
            <svg t="1716096459033" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2583" width="15" height="15"><path d="M64 512c0 195.2 124.8 361.6 300.8 422.4 22.4 6.4 19.2-9.6 19.2-22.4v-76.8c-134.4 16-140.8-73.6-150.4-89.6-19.2-32-60.8-38.4-48-54.4 32-16 64 3.2 99.2 57.6 25.6 38.4 76.8 32 105.6 25.6 6.4-22.4 19.2-44.8 35.2-60.8-144-22.4-201.6-108.8-201.6-211.2 0-48 16-96 48-131.2-22.4-60.8 0-115.2 3.2-121.6 57.6-6.4 118.4 41.6 124.8 44.8 32-9.6 70.4-12.8 112-12.8 41.6 0 80 6.4 112 12.8 12.8-9.6 67.2-48 121.6-44.8 3.2 6.4 25.6 57.6 6.4 118.4 32 38.4 48 83.2 48 131.2 0 102.4-57.6 188.8-201.6 214.4 22.4 22.4 38.4 54.4 38.4 92.8v112c0 9.6 0 19.2 16 19.2C832 876.8 960 710.4 960 512c0-246.4-201.6-448-448-448S64 265.6 64 512z" fill="#040000" p-id="2584"></path></svg>
          </a>
          <a href="mailto:boxizen@gmail.com" className="mr-2" target="_blank">
            <svg t="1716096543102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6338" width="15" height="15"><path d="M69.12 929.28L222.72 960V412.16c-51.2-37.376-102.4-75.264-153.6-112.64v629.76z" fill="#3399FF" p-id="6339"></path><path d="M514.56 632.32C366.08 521.216 217.6 410.624 69.12 299.52c-3.584-6.144-11.264-20.992-10.24-40.96 1.536-24.576 15.36-40.448 20.48-46.08 13.312-13.824 28.16-18.432 35.84-20.48 15.872-4.096 29.184-1.536 35.84 0 121.344 88.576 242.176 177.664 363.52 266.24 95.744-71.68 190.976-143.36 286.72-215.04v179.2c-95.744 70.144-190.976 139.776-286.72 209.92z" fill="#FF3333" p-id="6340"></path><path d="M954.88 929.28V304.64c-51.2 39.424-102.4 78.336-153.6 117.76v542.72c51.2-11.776 102.4-24.064 153.6-35.84z" fill="#339966" p-id="6341"></path><path d="M801.28 243.2v174.08c51.2-37.376 102.4-75.264 153.6-112.64 1.536-11.776 3.584-24.064 5.12-35.84-0.512-8.704-2.56-26.112-15.36-40.96-9.216-10.752-19.968-15.872-30.72-20.48-16.384-7.168-31.232-9.728-40.96-10.24-24.064 15.36-47.616 30.72-71.68 46.08z" fill="#FFCC00" p-id="6342"></path></svg>
          </a>
          <a href="javascript:void(0);" onClick={invokeWechat} className="mr-2" target="_blank">
            <svg t="1716096563883" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7364" width="15" height="15"><path d="M512 1024C229.23 1024 0 794.77 0 512S229.23 0 512 0s512 229.23 512 512-229.23 512-512 512z m107.91-626.371H640c-20.09-94.744-115.566-162.962-225.304-162.962-124.002 0-222.696 86.04-222.696 198.607 0 65.097 34.572 115.492 89.43 156.94l-23.114 71.12 77.995-41.448a354.748 354.748 0 0 0 77.97 11.8h20.114a133.608 133.608 0 0 1-5.851-47.47 193.122 193.122 0 0 1 57.466-134.412 181.37 181.37 0 0 1 133.096-52.175h0.804z m-115.273-56.296c15.848 0 28.696 14.288 28.696 31.915s-12.848 31.915-28.696 31.915c-17.652 1.95-33.402-12.313-35.304-31.94 0-22.284 17.457-31.89 34.719-31.89h0.585z m-171.032 63.878c-17.555 1.463-33.012-12.653-34.938-31.89 1.926-19.212 17.383-33.329 34.938-31.89 16.042 0 29.062 14.287 29.062 31.915 0 17.603-13.02 31.89-29.062 31.89zM832 574.805c0-92.233-90.136-169.472-192-169.472-107.764 0-192 77.24-192 169.448 0 92.257 84.456 169.496 192 169.496a264.24 264.24 0 0 0 66.828-11.873L767.586 768l-17.408-59.538c49.42-35.596 81.017-83.286 81.017-133.852l0.805 0.195zM573.562 554.52c-10.435 0-18.895-9.484-18.895-21.187s8.46-21.211 18.895-21.211c11.727-1.39 22.308 7.997 23.771 21.114-1.39 13.214-11.97 22.698-23.771 21.284z m128 0.098c-10.435 0-18.895-9.509-18.895-21.212 0-11.751 8.46-21.26 18.895-21.26 11.727-1.414 22.308 7.997 23.771 21.139-2.194 12.921-12.58 22.04-24.259 21.333h0.488z" fill="#0ABC64" p-id="7365"></path></svg>
          </a>
          <a href="https://twitter.com/EdwiinTsang" className="mr-2" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 50 50"><path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path></svg>
          </a>
        </div>
        <div className="mb-12 text-medium">“A minimalist website generated from notion. „</div>
      </div>
    </>
  )
}

const HeaderName = forwardRef(function HeaderName ({ siteTitle, siteDescription, postTitle, onClick }, ref) {
  return (
    <p
      ref={ref}
      className="header-name ml-2 font-medium text-gray-600 dark:text-gray-300 capture-pointer-events grid-rows-1 grid-cols-1 items-center"
      onClick={onClick}
    >
      {postTitle && <span className="post-title row-start-1 col-start-1">{postTitle}</span>}
      <span className="row-start-1 col-start-1">
        <span className="site-title">{siteTitle}</span>
        <span className="site-description font-normal">, {siteDescription}</span>
      </span>
    </p>
  )
})
