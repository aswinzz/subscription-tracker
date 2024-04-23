// pages/api/fetch-logo.js
import fetch from 'node-fetch';

// Function to fetch the logo of a website based on the URL
export default async function handler(req, res) {
  const { url } = req.query;

  try {
    // Fetch the website HTML
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch website');
    }

    // Read the HTML content
    const html = await response.text();

    // Extract the logo URL from the HTML
    const logoUrl = extractLogoUrl(html);

    if (!logoUrl) {
      throw new Error('Logo not found');
    }

    // Return the logo URL
    res.status(200).json({ logoUrl });
  } catch (error) {
    console.error('Error fetching logo:', error);
    res.status(500).json({ error: 'Failed to fetch logo URL' });
  }
}

// Function to extract the logo URL from the HTML content (You may need to adjust this logic based on the structure of the HTML)
function extractLogoUrl(html) {
  // Enhanced logic to extract logo URL from HTML, including various icon types
  // This approach attempts to accommodate different types of icons specified in the HTML
  let match = html.match(/<link.*?rel="icon".*?href="(.*?)".*?>/i);
  if (!match) {
    match = html.match(/<link.*?rel="apple-touch-icon".*?href="(.*?)".*?>/i);
  }
  if (!match) {
    match = html.match(/<link.*?rel="shortcut icon".*?href="(.*?)".*?>/i);
  }
  return match ? match[1] : null;
}
