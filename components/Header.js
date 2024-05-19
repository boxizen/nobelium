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

// function invokeWechat() {
//   const chatUrl = 'weixin://';
//   if(/ipad|iphone|mac/i.test(navigator.userAgent)) {
//     const ifr = document.createElement('iframe');
//     ifr.src = chatUrl;
//     ifr.style.display = 'none';
//     document.body.appendChild(ifr);
//   } else {
//     window.location.href = chatUrl;
//   }
// }

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
        <div className="text-4xl slogan mb-3">{BLOG.author}</div>
        <div className="flex mb-6">
          <a href="https://github.com/boxizen" className="mr-3 hover-tooltip" target="_blank">
            <svg t="1716096459033" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2583" width="20" height="20"><path d="M64 512c0 195.2 124.8 361.6 300.8 422.4 22.4 6.4 19.2-9.6 19.2-22.4v-76.8c-134.4 16-140.8-73.6-150.4-89.6-19.2-32-60.8-38.4-48-54.4 32-16 64 3.2 99.2 57.6 25.6 38.4 76.8 32 105.6 25.6 6.4-22.4 19.2-44.8 35.2-60.8-144-22.4-201.6-108.8-201.6-211.2 0-48 16-96 48-131.2-22.4-60.8 0-115.2 3.2-121.6 57.6-6.4 118.4 41.6 124.8 44.8 32-9.6 70.4-12.8 112-12.8 41.6 0 80 6.4 112 12.8 12.8-9.6 67.2-48 121.6-44.8 3.2 6.4 25.6 57.6 6.4 118.4 32 38.4 48 83.2 48 131.2 0 102.4-57.6 188.8-201.6 214.4 22.4 22.4 38.4 54.4 38.4 92.8v112c0 9.6 0 19.2 16 19.2C832 876.8 960 710.4 960 512c0-246.4-201.6-448-448-448S64 265.6 64 512z" fill="#040000" p-id="2584"></path></svg>
            {/* <span class="tooltip text-sm bg-gray-100 text-gray-800 p-2 rounded-md">Tooltip Text</span> */}
          </a>
          <a href="mailto:boxizen@gmail.com" className="mr-3 hover-tooltip" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
              <path d="M12 23.403V23.39 10.389L11.88 10.3h-.01L9.14 8.28C7.47 7.04 5.09 7.1 3.61 8.56 2.62 9.54 2 10.9 2 12.41v3.602L12 23.403zM38 23.39v.013l10-7.391V12.41c0-1.49-.6-2.85-1.58-3.83-1.46-1.457-3.765-1.628-5.424-.403L38.12 10.3 38 10.389V23.39zM14 24.868l10.406 7.692c.353.261.836.261 1.189 0L36 24.868V11.867L25 20l-11-8.133V24.868zM38 25.889V41c0 .552.448 1 1 1h6.5c1.381 0 2.5-1.119 2.5-2.5V18.497L38 25.889zM12 25.889L2 18.497V39.5C2 40.881 3.119 42 4.5 42H11c.552 0 1-.448 1-1V25.889z"></path>
            </svg>            
          </a>
          <a href="https://www.linkedin.com/in/%E6%9F%8F%E7%BE%B2-%E6%9B%BE-91b457240/" className="mr-3 hover-tooltip" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
            </svg>
          </a>
          <a href="https://twitter.com/EdwiinTsang" className="mr-3 hover-tooltip" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50"><path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path></svg>
          </a>
        </div>
        <div className="mb-12 text-medium">“ A minimalist website generated from notion. „</div>
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
