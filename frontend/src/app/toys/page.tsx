import React from 'react';
import BrandLanding from '@/components/BrandLanding';
import toysConfig, { metadata } from '@/data/brands/toys';

export { metadata };

export default function ToysLanding() {
  return <BrandLanding config={toysConfig} />;
}
