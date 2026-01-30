import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;
    navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none 
  bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.14),_transparent_70%)]
  blur-xl opacity-70"
      />
      <div className="absolute inset-0 -z-10 pointer-events-none 
  bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
      />



      {/* HERO */}
      <section className="relative mx-auto max-w-4xl px-4 pt-28 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Short links.{" "}
          <span className="text-destructive block sm:inline">
            Big impact.
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
          Turn long URLs into clean, memorable links you can manage and track —
          effortlessly.
        </p>

        {/* URL Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 mx-auto max-w-2xl flex flex-col sm:flex-row gap-3"
        >
          <Input
            ref={inputRef}
            type="url"
            placeholder="Paste your long URL here"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="h-12 text-base bg-zinc-900 border-white/10"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
          >
            Shorten
          </Button>
        </form>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 mt-28 grid gap-8 sm:grid-cols-3">
        {[
          {
            step: "01",
            title: "Paste your link",
            desc: "Drop your long URL into the input field and get ready to shorten it instantly.",
          },
          {
            step: "02",
            title: "Shorten instantly",
            desc: "We generate a clean, shareable short link you can use anywhere.",
          },
          {
            step: "03",
            title: "Manage & track",
            desc: "Monitor clicks and manage your links from a sleek dashboard.",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="relative rounded-2xl bg-zinc-900/60 border border-white/5 p-6 transition hover:border-destructive/40"
          >
            <span className="text-sm font-semibold text-destructive/80">
              {item.step}
            </span>
            <h3 className="mt-2 text-lg font-semibold">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-28 z-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              question: "What is SnapLnk?",
              answer: "SnapLnk is a modern URL shortener that helps you create, manage, and track short links.",
            },
            {
              question: "Is SnapLnk free?",
              answer: "Yes. You can start for free after creating an account.",
            },
            {
              question: "Do links expire?",
              answer: "No. Your links stay active until you delete them.",
            },
            {
              question: "Is SnapLnk secure?",
              answer: "All links are served over HTTPS with secure redirection.",
            },
            {
              question: "Can I customize my short links?",
              answer: "Absolutely! You can set a custom alias for your links to make them memorable.",
            },
            {
              question: "Can I track who clicked my link?",
              answer: "SnapLnk provides aggregate statistics such as clicks, location, and device info, without compromising user privacy.",
            },
            {
              question: "Can I delete a link?",
              answer: "Yes. You can delete any of your links from the dashboard at any time.",
            },
            {
              question: "Does SnapLnk have analytics?",
              answer: "Yes. You can view detailed analytics for each link, including clicks over time, location, and device type.",
            },
          ].map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex justify-between items-center font-medium text-left text-white hover:text-destructive transition-colors duration-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 mt-2 text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </div>
  );
};

export default LandingPage;
