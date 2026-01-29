import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import { StatsCounter } from "@/components/stats-counter";
import { FAQSection } from "@/components/faq-section";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, PenTool, GraduationCap, Code2, MapPin, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full bg-background glass-page-shell" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="home-ambient">
        <div className="glass-grid" aria-hidden />
        <div className="orb orb-a" aria-hidden />
        <div className="orb orb-b" aria-hidden />
        <div className="orb orb-c" aria-hidden />
      </div>

      <div className="relative z-10">
        <HeroSection />

      {/* Growth Tools Section */}
      <section className="w-full py-12 md:py-24 lg:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-foreground text-sm font-semibold mb-4 border border-white/20">⚡ Growth Tools</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              Powerful tools to accelerate your career
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Access all the resources you need in one place to master interviews and land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Build Resume */}
            <Link href="/resume">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Build Resume</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Create ATS-optimized resumes that stand out to recruiters
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Cover Letter */}
            <Link href="/ai-cover-letter">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <PenTool className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Cover Letter</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Generate compelling cover letters tailored to each job
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Interview Prep */}
            <Link href="/interview">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Interview Prep</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Master behavioral and technical interview questions
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Mock Interview Demo */}
            <Link href="/mock-interview-demo">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">AI Mock Interviews</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Practice with AI and get instant feedback
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Coding Practice */}
            <Link href="/leetcode">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <Code2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Coding Practice</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Solve coding problems and ace technical interviews
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Roadmap */}
            <Link href="/roadmap">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Career Roadmap</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Get a personalized roadmap tailored to your goals
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>

            {/* Learning Path */}
            <Link href="/learning-path">
              <LiquidGlassCard
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group h-full hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl cursor-pointer text-foreground"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] w-full">
                  <div className="p-4 rounded-full bg-white/10 border border-white/15 transition-colors text-foreground/90">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">Learning Path</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Follow a structured learning path for skill development
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="w-full py-14 md:py-26 lg:py-30 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-foreground text-sm font-semibold mb-4 border border-white/20">✨ Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-5 sm:mb-6 text-foreground leading-tight">
              Powerful features designed for success
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Everything you need to ace interviews and land your dream job
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <LiquidGlassCard
                key={index}
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="hover:scale-[1.02] transition-all duration-500 ease-out rounded-2xl p-6 sm:p-7 group text-foreground"
              >
                <CardContent className="text-center flex flex-col items-center gap-4 min-h-[220px] sm:min-h-[240px] lg:min-h-[260px]">
                  <div className="flex flex-col items-center justify-center gap-5 w-full">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed tracking-normal text-center">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-14 md:py-24 bg-muted/40">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StatsCounter stat="50+" label="Industries Covered" />
            <StatsCounter stat="1000+" label="Interview Questions" />
            <StatsCounter stat="95%" label="Success Rate" />
            <StatsCounter stat="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-14 md:py-26 lg:py-30 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-foreground text-sm font-semibold mb-4 border border-white/20">🚀 How it works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 sm:mb-6 leading-tight">
              Simple steps to success
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Get started with Watshibo in four simple steps and accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {howItWorks.map((item, index) => (
              <LiquidGlassCard
                key={index}
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="group flex flex-col items-center text-center space-y-6 p-6 sm:p-7 rounded-2xl transition-all duration-500 min-h-[240px] sm:min-h-[260px] text-foreground"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/15 rounded-full blur-lg transition-colors duration-300"></div>
                  <div className="relative w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-foreground/90 text-3xl shadow-inner group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground/80 mb-2">Step {index + 1}</div>
                  <h3 className="font-bold text-xl md:text-2xl tracking-tight mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-14 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-foreground text-sm font-semibold mb-4 border border-white/20">💬 Success Stories</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Loved by professionals
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed">
              Real feedback from people who accelerated their career with Watshibo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {testimonial.map((t, i) => (
              <LiquidGlassCard
                key={i}
                draggable={false}
                blurIntensity="xl"
                glowIntensity="sm"
                shadowIntensity="sm"
                className="rounded-2xl p-6 sm:p-7 flex flex-col gap-5 transition-all duration-300 group min-h-[240px] sm:min-h-[260px] text-foreground"
                aria-labelledby={`testimonial-title-${i}`}
              >
                <div className="flex items-start gap-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-5 h-5 ${idx < (t.rating ?? 5) ? "text-amber-400" : "text-muted-foreground/30"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.375 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.997 2.404c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.011 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69L9.05 2.927z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-base text-muted-foreground leading-relaxed font-medium">"{t.quote}"</blockquote>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted/30 ring-2 ring-primary/10">
                    <Image
                      src={t.image}
                      alt={t.author ?? "User avatar"}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      id={`testimonial-title-${i}`}
                      className="text-sm font-bold text-foreground truncate"
                    >
                      {t.author}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
      {/* CTA Section */}
      <section className="w-full">
        <LiquidGlassCard
          draggable={false}
          blurIntensity="xl"
          glowIntensity="sm"
          shadowIntensity="sm"
          className="mx-auto py-28 md:py-32 rounded-3xl mx-4 md:mx-6 text-foreground"
        >
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-foreground">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Transform Your Career Today
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
              Join thousands of professionals who have successfully landed their dream jobs with Watshibo's AI-powered interview companion.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-foreground text-background border border-foreground/30" variant='secondary'>
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </LiquidGlassCard>
      </section>
      </div>
    </div>
  );
}