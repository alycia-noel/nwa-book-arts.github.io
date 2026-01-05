# Ozark Book Arts Website

A website for Northwest Arkansas Book Arts, a collective of bookbinders, book conservators, book artists, and book lovers.

## Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Dynamic Events**: Events are loaded from CSV data and automatically categorized
- **Clean Navigation**: Easy-to-use navigation with header and footer
- **Contact Integration**: Direct links to Google Forms for membership
- **Resource Access**: Password-protected member resources

## Pages

- **Home (index.html)**: Landing page with hero section and about us information
- **Events (events.html)**: Upcoming and previous events listing
- **Member Resources (member-resources.html)**: Access to member-only resources

## Color Scheme

- Primary: #EAEEF1 (Light gray-blue)
- Secondary: #DEC1A6 (Warm beige)
- Accent: #536C7C (Blue-gray)
- Green: #677F3D (Olive green)
- Dark: #141B1F (Dark gray-black)

## Fonts

- **Display Font**: Sansita (for headings and titles)
- **Body Font**: Nunito Sans (for body text and navigation)

## GitHub Pages Deployment

This website is designed to work with GitHub Pages. Simply:

1. Push all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as the source
4. Your website will be available at `https://[username].github.io/[repository-name]`

## File Structure

```
├── index.html              # Landing page
├── events.html             # Events page
├── member-resources.html   # Member resources page
├── styles.css              # Main stylesheet
├── script.js               # JavaScript functionality
├── assets/                 # Images and data files
│   ├── events.csv         # Events data
│   ├── intro-photo.jpg    # Hero section image
│   ├── aboutus-image.jpg  # About us section image
│   └── contact-image.jpg  # Contact image (if needed)
└── references/            # Design reference images
```

## Updating Events

To add or modify events, edit the `assets/events.csv` file. The format is:

```
Upcoming, Event Name, Date, Time, Location, Description
True, "Event Name", "Date", "Time", "Location", "Description"
```

- Set `Upcoming` to `True` for upcoming events, `False` for previous events
- The website will automatically categorize and display events accordingly

## Customization

The website uses CSS custom properties (variables) for easy customization. Key variables are defined in `:root` in `styles.css`:

- Colors: `--color-primary`, `--color-secondary`, etc.
- Fonts: `--font-display`, `--font-body`
- Spacing: `--spacing-sm`, `--spacing-md`, etc.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement with JavaScript

## Contact

For questions about the website or to join Ozark Book Arts, visit: https://forms.gle/c7bKJwp8KhnTtTnp6