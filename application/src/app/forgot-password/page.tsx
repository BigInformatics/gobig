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
import { Mail, ArrowLeft } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Provider } from '@/components/ui/provider'

function ForgotPasswordPageContent() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (result.error) {
        console.error('[ForgotPassword] Error:', result.error)
        // For security, always show success message even if email doesn't exist
        // This prevents email enumeration attacks
        setSuccess(true)
      } else {
        console.log('[ForgotPassword] Success')
        setSuccess(true)
      }
    } catch (err) {
      console.error('[ForgotPassword] Exception:', err)
      // Still show success for security (don't reveal if email exists)
      setSuccess(true)
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
                <Heading size={{ base: '2xl', md: '3xl' }}>Reset Your Password</Heading>
                <Text color="fg.muted">
                  Enter your email address and we'll send you a link to reset your password
                </Text>
              </Stack>

              <Stack gap="6" width="full">
                {success ? (
                  <Card.Root size="sm" colorPalette="green">
                    <Card.Body>
                      <Stack gap="3">
                        <Text fontWeight="semibold" color="green.700">
                          Check Your Email
                        </Text>
                        <Text color="green.600" fontSize="sm">
                          If an account with that email exists, we've sent you a password reset link.
                          Please check your email and click the link to reset your password.
                        </Text>
                        <Text color="green.600" fontSize="sm" mt="2">
                          The link will expire in 1 hour.
                        </Text>
                        <Button
                          variant="outline"
                          colorPalette="green"
                          onClick={() => router.push('/login')}
                          mt="2"
                        >
                          <ArrowLeft /> Back to Login
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
                        <Field.Label>Email</Field.Label>
                        <InputGroup startElement={<Mail />} width="full">
                          <Input
                            type="email"
                            placeholder="zumie@cambigo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </InputGroup>
                      </Field.Root>

                      <Button
                        type="submit"
                        size="lg"
                        loading={isLoading}
                        loadingText="Sending..."
                        width="full"
                      >
                        Send Reset Link
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <Provider>
        <Flex height="full" flex="1" minH="100vh" alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Flex>
      </Provider>
    }>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}

