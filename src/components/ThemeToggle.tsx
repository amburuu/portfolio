'use client'

import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <label className="inline-flex items-center absolute top-4 right-4 z-50">
      <input type="checkbox" checked={isDark} value="" className="sr-only peer" readOnly/>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>   
      <div onClick={() => setTheme(isDark ? 'light' : 'dark')} className="relative cursor-pointer mx-3 w-9 h-5 bg-blue-950/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>  
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L18.6178 3.23558C18.8833 3.76656 19.016 4.03205 19.1934 4.26211C19.3507 4.46626 19.5337 4.64927 19.7379 4.80664C19.9679 4.98397 20.2334 5.11672 20.7644 5.38221L22 6L20.7644 6.61779C20.2334 6.88328 19.9679 7.01603 19.7379 7.19336C19.5337 7.35073 19.3507 7.53374 19.1934 7.73789C19.016 7.96795 18.8833 8.23344 18.6178 8.76442L18 10L17.3822 8.76442C17.1167 8.23344 16.984 7.96795 16.8066 7.73789C16.6493 7.53374 16.4663 7.35073 16.2621 7.19336C16.0321 7.01603 15.7666 6.88328 15.2356 6.61779L14 6L15.2356 5.38221C15.7666 5.11672 16.0321 4.98397 16.2621 4.80664C16.4663 4.64927 16.6493 4.46626 16.8066 4.26211C16.984 4.03205 17.1167 3.76656 17.3822 3.23558L18 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 13.3893C19.689 15.689 17.2145 17.2395 14.3779 17.2395C10.1711 17.2395 6.76075 13.8292 6.76075 9.62233C6.76075 6.78554 8.31149 4.31094 10.6115 3C5.77979 3.45812 2 7.52692 2 12.4785C2 17.7371 6.26292 22 11.5215 22C16.4729 22 20.5415 18.2206 21 13.3893Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    </label>
  )
}