'use client'

import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { Upload, User, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface PhotoUploadProps {
  src?: string
  onUpload: (file: File) => void | Promise<void>
  mb?: string | number
}

export function PhotoUpload({ src, onUpload, mb }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(src || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Upload failed:', error)
      setPreview(src || null) // Revert preview on error
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Stack gap="4" mb={mb}>
      <Box>
        <Stack gap="4" alignItems="flex-start">
          <Box
            position="relative"
            width="120px"
            height="120px"
            borderRadius="full"
            overflow="hidden"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="border.emphasized"
          >
            {preview ? (
              <Box
                as="img"
                src={preview}
                alt="Profile"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            ) : (
              <User size={48} color="gray" />
            )}
          </Box>

          <Stack gap="2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              size="sm"
              onClick={handleClick}
              leftIcon={<Upload />}
              loading={isUploading}
              disabled={isUploading}
            >
              {preview ? 'Change photo' : 'Upload photo'}
            </Button>
            {preview && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                leftIcon={<X />}
                colorPalette="red"
              >
                Remove
              </Button>
            )}
            <Text textStyle="xs" color="fg.muted">
              JPG, PNG or GIF. Max size 5MB.
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

