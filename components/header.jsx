                    import {
                      SignedOut,
                      SignedIn,
                      SignInButton,
                      SignUpButton,
                      UserButton,
                    } from "@clerk/nextjs";
                    import { Button } from "./ui/button";
                    import Link from "next/link";
                    import Image from "next/image";
                    import {
                      ChevronDown,
                      Code2,
                      DollarSign,
                      FileText,
                      GraduationCapIcon,
                      LayoutDashboard,
                      PenBox,
                      StarsIcon,
                      MapPin,
                      Zap,
                      BarChart3,
                      Menu,
                    } from "lucide-react";
                    import {
                      DropdownMenu,
                      DropdownMenuContent,
                      DropdownMenuItem,
                      DropdownMenuLabel,
                      DropdownMenuSeparator,
                      DropdownMenuTrigger,
                    } from "@/components/ui/dropdown-menu";
                    import { checkUser } from "@/lib/checkUser";
                    import ThemeSwitcher from "@/components/theme-switcher";

                    const Header = async () => {
                      try {
                        await checkUser();
                      } catch (error) {
                        console.error("Error checking user in header:", error);
                      }

                      return (
                        <header
                          className="border-b sticky top-0 z-50"
                          style={{
                            backgroundColor: "var(--nav-surface)",
                            color: "var(--card-foreground)",
                            backdropFilter: "saturate(180%) blur(10px)",
                            WebkitBackdropFilter: "saturate(180%) blur(10px)",
                            borderBottom: "1px solid var(--nav-border)",
                            boxShadow: "var(--nav-shadow)",
                          }}
                        >
                          <nav className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
                            {/* Logo */}
                            <Link href="/" className="flex items-center shrink-0">
                              <Image
                                src="/image.png"
                                alt="Logo"
                                width={120}
                                height={40}
                                className="h-10 sm:h-12 w-auto object-contain"
                                priority
                              />
                            </Link>

                            {/* Navigation & Auth */}
                            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
                              <ThemeSwitcher />

                              {/* Mobile compact menu for signed-in users */}
                              <SignedIn>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="md:hidden">
                                      <Menu className="h-4 w-4" />
                                      <span className="sr-only">Open navigation</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 liquid-glass-surface">
                                    <DropdownMenuLabel>Main</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                      <Link href="/dashboard" className="flex items-center gap-2 w-full">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Industry Insights</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/analytics" className="flex items-center gap-2 w-full">
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Analytics</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Growth Tools</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                      <Link href="/resume" className="flex items-center gap-2 w-full">
                                        <FileText className="h-4 w-4" />
                                        <span>Build Resume</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/ai-cover-letter" className="flex items-center gap-2 w-full">
                                        <PenBox className="h-4 w-4" />
                                        <span>Cover Letter</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/interview" className="flex items-center gap-2 w-full">
                                        <GraduationCapIcon className="h-4 w-4" />
                                        <span>Interview Prep</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/mock-interview-demo" className="flex items-center gap-2 w-full">
                                        <GraduationCapIcon className="h-4 w-4" />
                                        <span>Mock Interview Demo</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/leetcode" className="flex items-center gap-2 w-full">
                                        <Code2 className="h-4 w-4" />
                                        <span>Leetcode</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/roadmap" className="flex items-center gap-2 w-full">
                                        <MapPin className="h-4 w-4" />
                                        <span>Roadmap</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href="/learning-path" className="flex items-center gap-2 w-full">
                                        <Zap className="h-4 w-4" />
                                        <span>Structured Learning Path</span>
                                      </Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </SignedIn>

                              {/* Desktop navigation */}
                              <div className="hidden md:flex items-center gap-2 sm:gap-3">
                                <SignedIn>
                                  <Link href="/dashboard">
                                    <Button variant="ghost" size="sm">
                                      <LayoutDashboard className="h-4 w-4 mr-2" />
                                      <span className="hidden lg:inline">Industry Insights</span>
                                    </Button>
                                  </Link>

                                  <Link href="/analytics">
                                    <Button variant="ghost" size="sm">
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      <span className="hidden lg:inline">Analytics</span>
                                    </Button>
                                  </Link>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <StarsIcon className="h-4 w-4 mr-2" />
                                        <span className="hidden lg:inline">Growth Tools</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="liquid-glass-surface">
                                      <DropdownMenuLabel>Career Boosters</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link href="/resume" className="flex items-center gap-2 w-full">
                                          <FileText className="h-4 w-4" />
                                          <span>Build Resume</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/ai-cover-letter" className="flex items-center gap-2 w-full">
                                          <PenBox className="h-4 w-4" />
                                          <span>Cover Letter</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/interview" className="flex items-center gap-2 w-full">
                                          <GraduationCapIcon className="h-4 w-4" />
                                          <span>Interview Prep</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/mock-interview-demo" className="flex items-center gap-2 w-full">
                                          <GraduationCapIcon className="h-4 w-4" />
                                          <span>Mock Interview Demo</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/leetcode" className="flex items-center gap-2 w-full">
                                          <Code2 className="h-4 w-4" />
                                          <span>Leetcode</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/roadmap" className="flex items-center gap-2 w-full">
                                          <MapPin className="h-4 w-4" />
                                          <span>Roadmap</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href="/learning-path" className="flex items-center gap-2 w-full">
                                          <Zap className="h-4 w-4" />
                                          <span>Structured Learning Path</span>
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link href="/resume" className="flex items-center gap-2 w-full">
                                          <DollarSign className="h-4 w-4" />
                                          <span>Subscription</span>
                                        </Link>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </SignedIn>
                              </div>

                              {/* Auth Buttons */}
                              <SignedOut>
                                <SignInButton>
                                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">Sign In</Button>
                                </SignInButton>
                                <SignUpButton>
                                  <Button variant="outline" size="sm" className="hidden md:inline-flex">Sign Up</Button>
                                </SignUpButton>
                              </SignedOut>

                              <SignedIn>
                                <UserButton
                                  appearance={{
                                    elements: {
                                      avatarBox: "w-10 h-10",
                                      userButtonPopoverCard: "shadow-xl",
                                      userPreviewMainIdentifier: "font-semibold",
                                    },
                                  }}
                                  afterSignOutUrl="/"
                                />
                              </SignedIn>
                            </div>
                          </nav>
                        </header>
                      );
                    };

                    export default Header;