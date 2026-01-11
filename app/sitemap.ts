import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dilekceyaz.com' // Burayı kendi domaininle değiştir

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // İleride blog eklersen buraya eklersin
  ]
}