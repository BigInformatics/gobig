'use client'

import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Provider } from '@/components/ui/provider'

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const token = searchParams.get('token')

  // Check if token is present
  useEffect(() => {
    if (!token) {
      setTokenError('Invalid or missing reset token. Please request a new password reset link.')
    } else if (searchParams.get('error') === 'INVALID_TOKEN') {
      setTokenError('This password reset link is invalid or has expired. Please request a new one.')
    }
  }, [token, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.')
      return
    }

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
      const result = await authClient.resetPassword({
        token,
        newPassword: password,
      })

      if (result.error) {
        console.error('[ResetPassword] Error:', result.error)
        
        // Handle specific error cases
        if (result.error.message?.toLowerCase().includes('expired') || 
            result.error.message?.toLowerCase().includes('invalid')) {
          setTokenError('This password reset link has expired or is invalid. Please request a new one.')
        } else {
          setError(result.error.message || 'Failed to reset password')
        }
      } else {
        console.log('[ResetPassword] Success')
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      console.error('[ResetPassword] Exception:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Show error if token is missing or invalid
  if (tokenError || !token) {
    return (
      <Provider>
        <Flex height="full" flex="1" minH="100vh">
          <Box flex="1.5" py={{ base: '24', md: '32' }}>
            <Container maxW="md">
              <Stack gap="4" alignItems="center">
                {/* Cambigo Logo */}
                <Box>
                  <Link href="/" display="inline-block">
                    <Image
                      src="/assets/logo/cambigo-g.png"
                      alt="Cambigo Logo"
                      width={160}
                      height={56}
                      priority
                    />
                  </Link>
                </Box>

                <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                  <Heading size={{ base: '2xl', md: '3xl' }}>Invalid Reset Link</Heading>
                </Stack>

                <Stack gap="6" width="full">
                  <Card.Root size="sm" colorPalette="red">
                    <Card.Body>
                      <Text color="red.600">{tokenError || 'Invalid or missing reset token'}</Text>
                    </Card.Body>
                  </Card.Root>

                  <Button
                    variant="outline"
                    onClick={() => router.push('/forgot-password')}
                    width="full"
                  >
                    Request New Reset Link
                  </Button>

                  <Link variant="plain" href="/login" textAlign="center" display="flex" alignItems="center" justifyContent="center" gap="2">
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
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
            <Box
              position="absolute"
              inset="0"
              bg="black"
              opacity="0.1"
            />
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

  return (
    <Provider>
      <Flex height="full" flex="1" minH="100vh">
        <Box flex="1.5" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="4" alignItems="center">
              {/* Cambigo Logo */}
              <Box>
                <Link href="/" display="inline-block">
                  <Image
                    src="/assets/logo/cambigo-g.png"
                    alt="Cambigo Logo"
                    width={160}
                    height={56}
                    priority
                  />
                </Link>
              </Box>

              <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                <Heading size={{ base: '2xl', md: '3xl' }}>Set New Password</Heading>
                <Text color="fg.muted">
                  Enter your new password below
                </Text>
              </Stack>

              <Stack gap="6" width="full">
                {success ? (
                  <Card.Root size="sm" colorPalette="green">
                    <Card.Body>
                      <Stack gap="3" alignItems="center" textAlign="center">
                        <CheckCircle size={48} color="var(--chakra-colors-green-600)" />
                        <Text fontWeight="semibold" color="green.700" fontSize="lg">
                          Password Reset Successful
                        </Text>
                        <Text color="green.600" fontSize="sm">
                          Your password has been reset successfully. You will be redirected to the login page shortly.
                        </Text>
                        <Button
                          variant="outline"
                          colorPalette="green"
                          onClick={() => router.push('/login')}
                          mt="2"
                        >
                          Go to Login
                        </Button>
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Stack gap="5">
                      {error && (
                        <Card.Root size="sm" colorPalette="red">
                          <Card.Body>
                            <Text color="red.600">{error}</Text>
                          </Card.Body>
                        </Card.Root>
                      )}

                      <Field.Root>
                        <Field.Label>New Password</Field.Label>
                        <InputGroup startElement={<Lock />} width="full">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                          />
                        </InputGroup>
                        <Field.HelperText>
                          Must be at least 8 characters long
                        </Field.HelperText>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Confirm New Password</Field.Label>
                        <InputGroup startElement={<Lock />} width="full">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                          />
                        </InputGroup>
                      </Field.Root>

                      <Button
                        type="submit"
                        size="lg"
                        loading={isLoading}
                        loadingText="Resetting..."
                        width="full"
                      >
                        Reset Password
                      </Button>

                      <Link variant="plain" href="/login" textAlign="center" display="flex" alignItems="center" justifyContent="center" gap="2">
                        <ArrowLeft size={16} />
                        Back to Login
                      </Link>
                    </Stack>
                  </form>
                )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Provider>
        <Flex height="full" flex="1" minH="100vh" alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Flex>
      </Provider>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

