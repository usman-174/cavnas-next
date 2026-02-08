import { CabJsonLd } from "@/components/seo/CabJsonLd";
import { HomePageClient } from "@/components/landing/HomePageClient";
import { getTierCapacity } from "@/app/actions/tiers";

/**
 * Homepage - Server Component
 * 
 * Fetches tier capacity data server-side for:
 * - Improved SEO (search engines see actual data)
 * - Faster perceived load (no loading states)
 * - Better Core Web Vitals (LCP)
 * 
 * Client-side refresh still happens every 30 seconds for live updates.
 */
export default async function HomePage() {
  // Fetch tier capacity server-side during page render
  const initialTierData = await getTierCapacity();

  return (
    <>
      {/* SEO Structured Data */}
      <CabJsonLd />
      
      {/* Client-side interactive content with server-fetched data */}
      <HomePageClient initialTierData={initialTierData} />
    </>
  );
}
