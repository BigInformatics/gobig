'use client'

import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  Link,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Github, Lock, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Provider } from '@/components/ui/provider'

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const redirect = searchParams.get('redirect') || '/flow/dashboard'

  const handleSocialSignup = async (provider: 'github' | 'google') => {
    setError('')
    setSocialLoading(provider)

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: redirect,
      })

      if (result.error) {
        console.error(`[Signup] ${provider} error:`, result.error)
        setError(result.error.message || `Failed to sign up with ${provider}`)
        setSocialLoading(null)
      } else {
        // OAuth flow will redirect automatically
        console.log(`[Signup] ${provider} sign up initiated`)
      }
    } catch (err) {
      console.error(`[Signup] ${provider} exception:`, err)
      setError(err instanceof Error ? err.message : `An unexpected error occurred with ${provider}`)
      setSocialLoading(null)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      console.log('[Signup] Attempting sign up with email:', email)
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      console.log('[Signup] Result:', result)

      if (result.error) {
        console.error('[Signup] Error:', result.error)
        const errorMessage = result.error.message || 'Failed to sign up'
        const isConnectivityError = errorMessage.toLowerCase().includes('network') || 
                                   errorMessage.toLowerCase().includes('fetch') ||
                                   errorMessage.toLowerCase().includes('connection')
        setError(isConnectivityError ? 'Connection failed. Please check your internet connection and try again.' : errorMessage)
      } else {
        console.log('[Signup] Success, result:', result)
        
        // Wait for cookie to be set and propagated
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to dashboard
        console.log('[Signup] Redirecting to:', redirect)
        window.location.href = redirect
      }
    } catch (err) {
      console.error('[Signup] Exception:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      const isConnectivityError = errorMessage.toLowerCase().includes('network') || 
                                 errorMessage.toLowerCase().includes('fetch') ||
                                 errorMessage.toLowerCase().includes('connection') ||
                                 err instanceof TypeError
      setError(isConnectivityError ? 'Connection failed. Please check your internet connection and try again.' : errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Provider>
      <Flex height="full" flex="1" minH="100vh">
      <Box flex="1.5" py={{ base: '24', md: '32' }}>
        <Container maxW="md">
          <Stack gap="4" alignItems="center">
            {/* Logo */}
            <Box>
              <Link href="/" display="inline-block">
                <Image
                  src="/assets/logo/cambigo-g.png"
                  alt="Cambigo Logo"
                  width={100}
                  height={100}
                  priority
                />
              </Link>
            </Box>

            <Stack gap={{ base: '1', md: '2' }} textAlign="center">
              <Heading size={{ base: '2xl', md: '3xl' }}>Create your account</Heading>
              <Text mb="4" color="fg.muted">Start building flows and planning your projects</Text>
            
              <Text textStyle="sm" color="fg.muted" fontWeight="medium" textAlign="center">
                Already have an account?{' '}
                <Link href="/login" variant="underline">
                  Sign in
                </Link>
                .
              </Text>
            
            
            </Stack>

            <Stack gap="6" width="full">
              {/* Social Signup Options */}
              <Stack gap="6" colorPalette="gray" width="full">
                <Button
                  colorPalette="gray"
                  size="lg"
                  w="full"
                  onClick={() => handleSocialSignup('github')}
                  loading={socialLoading === 'github'}
                  loadingText="Connecting..."
                  disabled={!!socialLoading}
                >
                  <Github />
                  Sign up with GitHub
                </Button>
                <Button
                  colorPalette="blue"
                  size="lg"
                  w="full"
                  onClick={() => handleSocialSignup('google')}
                  loading={socialLoading === 'google'}
                  loadingText="Connecting..."
                  disabled={!!socialLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </Button>
              </Stack>

              <HStack gap="6">
                <Separator flex="1" />
                <Text textStyle="sm" color="fg.muted">
                  or
                </Text>
                <Separator flex="1" />
              </HStack>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignup}>
                <Stack gap="5">
                  {error && (
                    <Card.Root size="sm" colorPalette="red">
                      <Card.Body>
                        <VStack gap={2} align="stretch">
                          <Text color="red.600">{error}</Text>
                          {(error.toLowerCase().includes('connection') || error.toLowerCase().includes('network')) && (
                            <Button
                              size="sm"
                              variant="outline"
                              colorPalette="red"
                              onClick={handleEmailSignup}
                              loading={isLoading}
                              width="full"
                            >
                              Retry
                            </Button>
                          )}
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  )}

                  <Field.Root>
                    <Field.Label hideBelow="md">Name</Field.Label>
                    <InputGroup startElement={<Mail />} flex="1">
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minH={{ base: "44px", md: "auto" }}
                      />
                    </InputGroup>
                    <Field.ErrorText />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label hideBelow="md">Email</Field.Label>
                    <InputGroup startElement={<Mail />} flex="1">
                      <Input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="zumie@cambigo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        minH={{ base: "44px", md: "auto" }}
                      />
                    </InputGroup>
                    <Field.ErrorText />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label hideBelow="md">Password</Field.Label>
                    <InputGroup startElement={<Lock />} flex="1">
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        minH={{ base: "44px", md: "auto" }}
                      />
                    </InputGroup>
                    <Field.HelperText color="fg.muted" textStyle="sm">
                      Must be at least 8 characters
                    </Field.HelperText>
                    <Field.ErrorText />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label hideBelow="md">Confirm Password</Field.Label>
                    <InputGroup startElement={<Lock />} flex="1">
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minH={{ base: "44px", md: "auto" }}
                      />
                    </InputGroup>
                    <Field.ErrorText />
                  </Field.Root>

                  <Button
                    type="submit"
                    size="lg"
                    loading={isLoading}
                    loadingText="Creating account..."
                    width="full"
                  >
                    Create account
                  </Button>

                  <Link variant="plain" href="/login" textAlign="center">
                    Already have an account? Sign in
                  </Link>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Cover Image Background - Right Side (hidden on mobile) */}
      <Box flex="1" hideBelow="lg" position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset="0"
          backgroundImage="url('/assets/page/splash.webp')"
          backgroundRepeat="no-repeat"
          className="cover-image-pan"
          style={{
            height: '100%',
            width: '100%',
          }}
        />
        {/* Optional overlay for better text readability if needed */}
        <Box
          position="absolute"
          inset="0"
          bg="black"
          opacity="0.1"
        />
        {/* Centered Logo */}
        <Box
          position="absolute"
          inset="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1"
        >
          <Image
            src="/assets/logo/cambigo-w.png"
            alt="Cambigo"
            width={300}
            height={300}
            style={{
              maxWidth: '80%',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
    </Flex>
    </Provider>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Provider>
        <Flex height="full" flex="1" minH="100vh" alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Flex>
      </Provider>
    }>
      <SignupPageContent />
    </Suspense>
  )
}

