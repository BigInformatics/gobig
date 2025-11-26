import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoUpload } from '@/components/settings/PhotoUpload';
import { Provider } from '@/components/ui/provider';

// Mock window.alert
global.alert = vi.fn();

describe('PhotoUpload Component', () => {
  const mockOnUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnUpload.mockClear();
  });

  it('should render upload button when no image is provided', () => {
    render(
      <Provider>
        <PhotoUpload onUpload={mockOnUpload} />
      </Provider>
    );

    expect(screen.getByText('Upload photo')).toBeInTheDocument();
    expect(screen.getByText('JPG, PNG or GIF. Max size 5MB.')).toBeInTheDocument();
  });

  it('should render image preview when src is provided', () => {
    render(
      <Provider>
        <PhotoUpload src="https://example.com/image.jpg" onUpload={mockOnUpload} />
      </Provider>
    );

    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(screen.getByText('Change photo')).toBeInTheDocument();
  });

  it('should show remove button when preview exists', () => {
    render(
      <Provider>
        <PhotoUpload src="https://example.com/image.jpg" onUpload={mockOnUpload} />
      </Provider>
    );

    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('should handle file selection and create preview', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Mock FileReader
    let mockFileReaderInstance: any;
    class MockFileReader {
      readAsDataURL = vi.fn((file: File) => {
        // Simulate async FileReader behavior
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: 'data:image/jpeg;base64,test' } } as any);
          }
        }, 0);
      });
      result = 'data:image/jpeg;base64,test';
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
    }

    vi.spyOn(window, 'FileReader').mockImplementation(function(this: any) {
      mockFileReaderInstance = new MockFileReader();
      return mockFileReaderInstance as any;
    });

    mockOnUpload.mockResolvedValue(undefined);

    render(
      <Provider>
        <PhotoUpload onUpload={mockOnUpload} />
      </Provider>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Simulate file selection
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(mockFileReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
    });

    // Verify upload was called
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
    }, { timeout: 2000 });
  });

  it('should validate file type and reject non-image files', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    render(
      <Provider>
        <PhotoUpload onUpload={mockOnUpload} />
      </Provider>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Use DataTransfer to properly set files on the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // Create and dispatch change event
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);

    // Wait for validation to run (alert is synchronous)
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Please select an image file');
    }, { timeout: 1000 });

    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('should validate file size and reject files larger than 5MB', async () => {
    const user = userEvent.setup();
    // Create a mock file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    render(
      <Provider>
        <PhotoUpload onUpload={mockOnUpload} />
      </Provider>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, largeFile);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Image must be less than 5MB');
    });

    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('should handle upload errors and revert preview', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const originalSrc = 'https://example.com/original.jpg';

    let mockFileReaderInstance: any;
    let onloadHandler: ((e: any) => void) | null = null;
    
    class MockFileReader {
      readAsDataURL = vi.fn((file: File) => {
        // Simulate async FileReader behavior
        setTimeout(() => {
          if (onloadHandler) {
            onloadHandler({ target: { result: 'data:image/jpeg;base64,new' } });
          }
        }, 10);
      });
      result = 'data:image/jpeg;base64,new';
      set onload(callback: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null) {
        onloadHandler = callback as any;
      }
      get onload() {
        return onloadHandler as any;
      }
    }

    vi.spyOn(window, 'FileReader').mockImplementation(function(this: any) {
      mockFileReaderInstance = new MockFileReader();
      return mockFileReaderInstance as any;
    });
    
    mockOnUpload.mockRejectedValue(new Error('Upload failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Provider>
        <PhotoUpload src={originalSrc} onUpload={mockOnUpload} />
      </Provider>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });

    // After error, preview should revert to original
    await waitFor(() => {
      const img = screen.getByAltText('Profile');
      expect(img).toHaveAttribute('src', originalSrc);
    }, { timeout: 2000 });

    expect(consoleSpy).toHaveBeenCalledWith('Upload failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle remove button click', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <PhotoUpload src="https://example.com/image.jpg" onUpload={mockOnUpload} />
      </Provider>
    );

    const removeButton = screen.getByText('Remove');
    await user.click(removeButton);

    // After remove, should show upload button again
    await waitFor(() => {
      expect(screen.getByText('Upload photo')).toBeInTheDocument();
    });
  });

  it('should disable upload button while uploading', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    let mockFileReaderInstance: any;
    class MockFileReader {
      readAsDataURL = vi.fn((file: File) => {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: 'data:image/jpeg;base64,test' } } as any);
          }
        }, 0);
      });
      result = 'data:image/jpeg;base64,test';
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
    }

    vi.spyOn(window, 'FileReader').mockImplementation(function(this: any) {
      mockFileReaderInstance = new MockFileReader();
      return mockFileReaderInstance as any;
    });

    // Create a promise that we can control
    let resolveUpload: () => void;
    const uploadPromise = new Promise<void>((resolve) => {
      resolveUpload = resolve;
    });
    mockOnUpload.mockReturnValue(uploadPromise);

    render(
      <Provider>
        <PhotoUpload onUpload={mockOnUpload} />
      </Provider>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);

    // Wait for FileReader to complete and upload to start
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });

    // Button should be disabled while uploading
    await waitFor(() => {
      const uploadButton = screen.getByText('Change photo');
      expect(uploadButton).toBeDisabled();
    });

    // Resolve upload
    resolveUpload!();

    await waitFor(() => {
      const uploadButton = screen.getByText('Change photo');
      expect(uploadButton).not.toBeDisabled();
    }, { timeout: 2000 });
  });
});

