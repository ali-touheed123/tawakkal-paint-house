import { NextResponse } from 'next/server';

export async function POST() {
  const host = 'tawakkalpainthouse.com';
  const key = '8f7b2c9e10a34b528c11e0f09a123456';
  const keyLocation = `https://${host}/${key}`;
  
  // In a real production app, you would fetch all your product URLs here.
  // For now, we'll ping the main sitemap and a few key URLs.
  const urlList = [
    `https://${host}/`,
    `https://${host}/category/decorative`,
    `https://${host}/category/industrial`,
    `https://${host}/category/auto`,
    `https://${host}/category/projects`,
    `https://${host}/deals`
  ];

  try {
    // Ping Bing/Yandex IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Search engines notified successfully.' });
    } else {
      const error = await response.text();
      return NextResponse.json({ success: false, message: 'Failed to notify search engines.', error }, { status: response.status });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Error calling IndexNow API.' }, { status: 500 });
  }
}
