# How to Use Your Own Cricket Stadium Background Image

## Option 1: Using a Local Image File

1. Place your cricket stadium image in the `public` folder
2. Name it `stadium-bg.jpg` (or any name you prefer)
3. Update `src/App.css` line 34-36:

```css
background: 
  linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),
  url('/stadium-bg.jpg');
```

## Option 2: Using an Image URL

Simply replace the URL in `src/App.css` line 35 with your image URL:

```css
background: 
  linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),
  url('YOUR_IMAGE_URL_HERE');
```

## Recommended Image Specifications

- **Format**: JPG or PNG
- **Aspect Ratio**: 16:9 or wider (landscape)
- **Resolution**: 1920x1080 or higher for best quality
- **File Size**: Optimize to under 2MB for faster loading

## Current Setup

The app currently uses a cricket stadium image from Unsplash. To use your own image, follow the steps above.
