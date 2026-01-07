import { ORGANIZATION_SCHEMA, FAQ_SCHEMA, SERVICE_SCHEMA } from '@/lib/seo-config';

export const CAB_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION_SCHEMA, FAQ_SCHEMA, SERVICE_SCHEMA],
};

export function CabJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(CAB_JSON_LD),
      }}
    />
  );
}
