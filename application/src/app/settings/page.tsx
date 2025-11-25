'use client'

import { Button, Container, Field, Input, Stack, Text } from '@chakra-ui/react'
import { FormSection } from '@/components/settings/FormSection'
import { PhotoUpload } from '@/components/settings/PhotoUpload'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import logger from '@/lib/logger'
import { Provider } from '@/components/ui/provider'

export default function SettingsPage() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!session?.user) {
    router.push('/login')
    return null
  }

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    try {
      // Use Better Auth's updateUser method
      // Note: Email changes require verification via changeEmail method, so we only update name here
      const result = await authClient.updateUser({
        name,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully')
    } catch (err) {
      logger.error('[Settings] Failed to update profile', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string

    try {
      // Use Better Auth's changePassword method
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true, // Invalidate other sessions for security
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update password')
      }

      setSuccess('Password updated successfully')
      e.currentTarget.reset()
    } catch (err) {
      logger.error('[Settings] Failed to update password', err)
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Convert file to base64 or data URL
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const imageUrl = e.target?.result as string

          // Use Better Auth's updateUser method to update image
          const result = await authClient.updateUser({
            image: imageUrl,
          })

          if (result.error) {
            throw new Error(result.error.message || 'Failed to upload photo')
          }

          setSuccess('Photo uploaded successfully')
        } catch (err) {
          logger.error('[Settings] Failed to upload photo', err)
          setError(err instanceof Error ? err.message : 'Failed to upload photo')
          setIsLoading(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      logger.error('[Settings] Failed to upload photo', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone. All of your information will be lost.')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use Better Auth's deleteUser method
      const result = await authClient.deleteUser({
        callbackURL: '/', // Redirect to home after deletion
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete account')
      }

      // User will be redirected automatically by Better Auth
      // But we can also manually redirect if needed
      router.push('/')
    } catch (err) {
      logger.error('[Settings] Failed to delete account', err)
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setIsLoading(false)
    }
  }

  return (
    <Provider>
      <Container maxW="4xl" py="20">
        <Stack gap="10">
          {error && (
            <Text color="red.500" textStyle="sm">
              {error}
            </Text>
          )}
          {success && (
            <Text color="green.500" textStyle="sm">
              {success}
            </Text>
          )}

          <form onSubmit={handleProfileUpdate}>
            <FormSection title="Profile Information" description="Update your profile information">
              <PhotoUpload
                src={session.user.image || undefined}
                onUpload={handlePhotoUpload}
                mb="8"
              />
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="name" defaultValue={session.user.name || ''} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Input type="email" name="email" defaultValue={session.user.email || ''} disabled />
                <Field.HelperText color="fg.muted" textStyle="sm">
                  Email changes require verification. Use the change email feature when available.
                </Field.HelperText>
              </Field.Root>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </FormSection>
          </form>

          <form onSubmit={handlePasswordUpdate}>
            <FormSection title="Password" description="Update your password">
              <Field.Root>
                <Field.Label>Current password</Field.Label>
                <Input type="password" name="currentPassword" required />
              </Field.Root>
              <Field.Root>
                <Field.Label>New password</Field.Label>
                <Input type="password" name="newPassword" required />
              </Field.Root>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </FormSection>
          </form>

          <FormSection title="Danger Zone" description="Delete your account">
            <Text color="fg.muted">
              Once you delete your account, there is no going back. All of your information will be
              lost. Before you go, please download your information.
            </Text>
            <Button colorPalette="red" onClick={handleDeleteAccount} disabled={isLoading}>
              Delete account
            </Button>
          </FormSection>
        </Stack>
      </Container>
    </Provider>
  )
}

