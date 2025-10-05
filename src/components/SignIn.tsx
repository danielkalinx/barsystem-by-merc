'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/Logo'

export default function SignIn() {
  const [checked, setChecked] = useState(true)

  return (
    <div className="h-screen flex lg:flex-row flex-col">
      {/* Left side - Sign in form */}
      <div className="bg-background flex-1 h-screen flex flex-col items-center justify-center px-6 py-24 relative">
        {/* Logo positioned at top left */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
          <Logo size={36} />
        </div>

        {/* Sign in form */}
        <div className="w-full max-w-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold leading-9 text-card-foreground">Sign in</h1>
            <p className="text-sm leading-5 text-muted-foreground">
              Log in to unlock tailored content and stay connected with your community.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              className="h-9 rounded-md border-input bg-background text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              className="h-9 rounded-md border-input bg-background text-sm"
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keep-signed-in"
                  checked={checked}
                  onCheckedChange={(value) => setChecked(value as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="keep-signed-in" className="text-sm font-medium text-foreground">
                  Keep me signed in
                </label>
              </div>
              <button className="text-sm text-muted-foreground underline">Forgot password?</button>
            </div>
          </div>

          {/* Submit button */}
          <Button className="w-full h-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign in
          </Button>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile, visible on lg) */}
      <div className="hidden lg:block flex-1 h-screen relative bg-muted">
        <Image
          src="/signin-background.jpg"
          alt="Sign in background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
