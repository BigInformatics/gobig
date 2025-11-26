# Required Assets

This directory should contain the following assets used by the application:

## Logo Files

### `/assets/logo/cambigo-g.png`
- **Purpose**: Logo for light backgrounds (used on login, signup, forgot-password pages)
- **Recommended size**: 100x100px or larger (will be scaled)
- **Format**: PNG with transparency

### `/assets/logo/cambigo-w.png`
- **Purpose**: Logo for dark backgrounds (used on splash screens)
- **Recommended size**: 300x300px or larger (will be scaled)
- **Format**: PNG with transparency

## Page Assets

### `/assets/page/splash.webp`
- **Purpose**: Background image for authentication pages (login, signup, forgot-password, reset-password)
- **Recommended size**: 1920x1080px or larger
- **Format**: WebP (optimized for web)
- **Usage**: Used as background image on the right side of split-screen layout

## Setup Instructions

1. Create the directory structure:
   ```bash
   mkdir -p public/assets/logo
   mkdir -p public/assets/page
   ```

2. Add your logo files:
   - Place `cambigo-g.png` in `public/assets/logo/`
   - Place `cambigo-w.png` in `public/assets/logo/`

3. Add your splash image:
   - Place `splash.webp` in `public/assets/page/`

## Placeholder/Default Behavior

If these assets are not present, the pages will still function but will show broken image placeholders. You can:

1. Replace with your own branding assets
2. Use placeholder services temporarily
3. Remove the image references from the pages if not needed

## CSS Classes

The splash image uses a CSS class `cover-image-pan` which should be defined in your global CSS for any special styling effects.



