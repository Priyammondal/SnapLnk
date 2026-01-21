import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import Banner from '../assets/banner.png'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (longUrl.trim() === '') return;
    navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);

  }
  return (
    <div className='flex flex-col items-center'>
      <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-center text-white font-extrabold'>The only URL Shortner <br /> you&rsquo;ll ever need!👇</h2>
      <form onSubmit={handleSubmit} className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'>
        <Input value={longUrl} type="url" placeholder="Enter your loooong URL" onChange={(e) => setLongUrl(e.target.value)} className="h-full flex-1 py-4 px-4" />
        <Button className="h-full" type="submit" variant='destructive'>Shorten</Button>
      </form>
      <img src={Banner} alt="banner" className='w-full my-11 md:px-11' />

      <Accordion type="multiple" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is SnapLnk?</AccordionTrigger>
          <AccordionContent>
            SnapLnk is a fast and simple URL shortener that helps you convert long,
            messy links into clean, shareable short links in seconds.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Is SnapLnk free to use?</AccordionTrigger>
          <AccordionContent>
            Yes! SnapLnk offers free URL shortening with no sign-up required for
            basic usage.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Do shortened links expire?</AccordionTrigger>
          <AccordionContent>
            By default, SnapLnk links do not expire. Expiration options may be added
            in future updates.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is SnapLnk secure?</AccordionTrigger>
          <AccordionContent>
            Absolutely. SnapLnk uses HTTPS and follows best security practices to
            ensure your links are safe and reliable.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Can I track link analytics?</AccordionTrigger>
          <AccordionContent>
            Basic analytics such as click counts will be available, with more
            detailed insights planned for upcoming versions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Can I use SnapLnk on mobile?</AccordionTrigger>
          <AccordionContent>
            Yes. SnapLnk is fully responsive and works seamlessly across mobile,
            tablet, and desktop devices.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  )
}

export default LandingPage