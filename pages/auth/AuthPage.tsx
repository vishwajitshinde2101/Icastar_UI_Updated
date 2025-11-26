import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, Users, Star, Camera, Music } from 'lucide-react'
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroBg from '../../assets/hero-stage.jpg'
import logo from '../../assets/icaster.png'
import ctaBg from '../../assets/cta-bg.jpg'
import { features, roles } from './utils'

const AuthPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const rolesSectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section
        className='relative min-h-screen flex items-center justify-center overflow-hidden'
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className='absolute inset-0 bg-white/5 backdrop-blur-md' />

        <div className='relative z-10 container mx-auto px-4'>
          <div className='max-w-4xl mx-auto space-y-1 text-center'>
            <div className='flex justify-center py-1'>
              <img
                src={logo}
                alt='iCaster'
                className='h-26 md:h-32 w-auto object-contain'
              />
            </div>

            <p className='text-lg md:text-xl text-muted-foreground leading-relaxed px-4 text-slate-900'>
              Where Talent Meets Opportunity. Connect artists with casting
              directors through video auditions, live casting calls, and
              professional portfolio management.
            </p>
          </div>

          <div className='flex flex-row gap-4 justify-center mb-12 mt-6'>
            <Button
              size='lg'
              className='w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90'
              asChild>
              <a
                href='#roles'
                onClick={e => {
                  e.preventDefault()
                  rolesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}>
                Get Started
                <ArrowRight className='ml-2 h-5 w-5' />
              </a>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='w-auto text-lg px-8 py-6 bg-secondary/20 hover:bg-primary/10'>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className='py-12 md:py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Choose Your Path
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Select your role to access personalized features and start your
              journey with iCastar
            </p>
          </div>

          <div
            id='roles'
            ref={rolesSectionRef}
            className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {roles.map(role => {
              const Icon = role.icon
              return (
                <Card
                  key={role.id}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 group ${
                    selectedRole === role.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedRole(role.id)
                    navigate(`/auth?role=${role.id}`)
                  }}>
                  <div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-br ${role.color}`}
                  />

                  <CardHeader className='relative'>
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className='h-8 w-8 text-white' />
                    </div>
                    <CardTitle className='text-2xl'>{role.title}</CardTitle>
                    <CardDescription className='text-lg font-medium text-primary'>
                      {role.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='relative'>
                    <p className='text-muted-foreground mb-6 leading-relaxed'>
                      {role.description}
                    </p>

                    <div className='space-y-2'>
                      <h4 className='font-semibold text-sm uppercase tracking-wide text-primary'>
                        Key Features:
                      </h4>
                      <div className='grid grid-cols-1 gap-2'>
                        {role.features.map((feature, index) => (
                          <div
                            key={index}
                            className='flex items-center text-sm text-muted-foreground'>
                            <div className='w-2 h-2 rounded-full bg-primary mr-3' />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className={`w-full mt-6 bg-gradient-to-r ${role.color} hover:opacity-90 transition-all duration-300`}
                      size='lg'
                      asChild>
                      <Link to={`/auth?role=${role.id}`}>
                        Continue as {role.title}
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-12 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              How iCastar Works
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Get started in three simple steps and begin your journey to
              success
            </p>
          </div>

          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-8'>
            <div className='text-center group'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl font-bold text-white'>1</span>
              </div>
              <h3 className='text-2xl font-semibold mb-4'>
                Create Your Profile
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Build your professional portfolio with photos, videos, and
                performance reels. Showcase your unique talents and skills.
              </p>
            </div>

            <div className='text-center group'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl font-bold text-white'>2</span>
              </div>
              <h3 className='text-2xl font-semibold mb-4'>
                Connect & Audition
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Find casting calls, submit auditions, and connect directly with
                casting directors and talent agents worldwide.
              </p>
            </div>

            <div className='text-center group'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <span className='text-2xl font-bold text-white'>3</span>
              </div>
              <h3 className='text-2xl font-semibold mb-4'>
                Land Your Dream Role
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Get hired for amazing opportunities and build your career with
                our comprehensive management tools and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className='py-12 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Join Our Growing Community
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Thousands of artists and casting directors trust iCastar for their
              career success
            </p>
          </div>

          <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='text-4xl md:text-5xl font-bold text-orange-600 mb-2'>
                50K+
              </div>
              <p className='text-muted-foreground font-medium'>
                Active Artists
              </p>
            </div>
            <div className='text-center'>
              <div className='text-4xl md:text-5xl font-bold text-orange-500 mb-2'>
                2K+
              </div>
              <p className='text-muted-foreground font-medium'>
                Casting Directors
              </p>
            </div>
            <div className='text-center'>
              <div className='text-4xl md:text-5xl font-bold text-amber-500 mb-2'>
                100K+
              </div>
              <p className='text-muted-foreground font-medium'>
                Successful Auditions
              </p>
            </div>
            <div className='text-center'>
              <div className='text-4xl md:text-5xl font-bold text-orange-600 mb-2'>
                95%
              </div>
              <p className='text-muted-foreground font-medium'>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-12 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              What Our Users Say
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Real stories from artists and casting directors who found success
              with iCastar
            </p>
          </div>

          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-8'>
            <Card className='p-6 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center mr-4'>
                  <Star className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold'>Sarah Johnson</h4>
                  <p className='text-sm text-muted-foreground'>
                    Professional Actress
                  </p>
                </div>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                "iCastar completely transformed my career. I landed three major
                roles within the first month of joining. The platform is
                intuitive and connects you with real opportunities."
              </p>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center mr-4'>
                  <Users className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold'>Michael Chen</h4>
                  <p className='text-sm text-muted-foreground'>
                    Casting Director
                  </p>
                </div>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                "As a casting director, iCastar has streamlined my entire
                workflow. Finding the perfect talent has never been easier, and
                the quality of submissions is outstanding."
              </p>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow duration-300'>
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-orange-900 to-orange-500 flex items-center justify-center mr-4'>
                  <Camera className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold'>Emma Rodriguez</h4>
                  <p className='text-sm text-orange-50/80'>Voice Artist</p>
                </div>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                "The video audition feature is game-changing. I can showcase my
                talent from anywhere in the world and the feedback system helps
                me improve constantly."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-12 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Platform Features
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Discover the powerful tools and features that make iCastar the
              premier talent management platform
            </p>
          </div>

          <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className='text-center p-6 hover:shadow-lg transition-shadow duration-300 border-border/50'>
                  <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4'>
                    <Icon className='h-8 w-8 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className='relative py-16 md:py-20 bg-fixed overflow-hidden'
        style={{
          backgroundImage: `url(${ctaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}>
        <div className='absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-500/10' />
        <div className='container mx-auto px-4 text-center relative z-10'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
            Ready to Transform Your Career?
          </h2>
          <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
            Join thousands of artists and recruiters who are already using
            iCastar to build successful careers
          </p>
          <Button
            size='lg'
            className='w-full sm:w-auto text-lg px-12 py-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 border-0'
            asChild>
            <a
              href='#roles'
              onClick={e => {
                e.preventDefault()
                rolesSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}>
              Get Started Today
              <ArrowRight className='ml-2 h-5 w-5' />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gradient-to-br from-orange-600 via-amber-400 to-orange-600 text-white py-12 md:py-16 border-t border-white/20'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8'>
            <div className='col-span-1 lg:col-span-2'>
              <div className='flex justify-start py-1'>
                <img
                  src={logo}
                  alt='iCaster'
                  className='h-20 md:h-24 w-auto object-contain'
                />
              </div>
              <p className='text-white/80 mb-6 max-w-md'>
                The premier platform connecting talented artists with casting
                directors worldwide. Where dreams meet opportunity.
              </p>
              <div className='flex space-x-4'>
                <div className='w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors'>
                  <Star className='h-5 w-5' />
                </div>
                <div className='w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors'>
                  <Camera className='h-5 w-5' />
                </div>
                <div className='w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors'>
                  <Music className='h-5 w-5' />
                </div>
              </div>
            </div>

            <div className='col-span-1 sm:col-span-2 lg:col-span-2'>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-semibold mb-4 text-white'>For Artists</h4>
                  <ul className='space-y-2 text-white/80'>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Create Portfolio
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Find Auditions
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Video Submissions
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Profile Analytics
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className='font-semibold mb-4 text-white'>
                    For Recruiters
                  </h4>
                  <ul className='space-y-2 text-white/80'>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Post Casting Calls
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Discover Talent
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Live Auditions
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-white transition-colors'>
                        Subscription Plans
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center'>
            <p className='text-white/70 text-sm text-center md:text-left'>
              © 2024 iCastar. All rights reserved. Connecting talent with
              opportunity.
            </p>
            <div className='flex space-x-6 mt-4 md:mt-0'>
              <a
                href='#'
                className='text-white/70 hover:text-white text-sm transition-colors'>
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-white/70 hover:text-white text-sm transition-colors'>
                Terms of Service
              </a>
              <a
                href='#'
                className='text-white/70 hover:text-white text-sm transition-colors'>
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthPage
