import { atom } from 'nanostores';
import type { Provider } from '../data/providers';

export interface Filters {
  speed: {
    download: {
      min: number | null;
      max: number | null;
    };
    upload: {
      min: number | null;
      max: number | null;
    };
  };
  price: {
    monthly: {
      min: number | null;
      max: number | null;
    };
  };
  features: {
    hasSetupFee: boolean;
    hasEdevlet: boolean;
    isPrepaid: boolean;
    hasCommitment: boolean;
    includesModem: boolean;
  };
}

export type SortOption = 'price-asc' | 'price-desc' | 'speed-asc' | 'speed-desc';

// Initial filter state
export const filters = atom<Filters>({
  speed: {
    download: { min: null, max: null },
    upload: { min: null, max: null },
  },
  price: {
    monthly: { min: null, max: null },
  },
  features: {
    hasSetupFee: false,
    hasEdevlet: false,
    isPrepaid: false,
    hasCommitment: false,
    includesModem: false,
  },
});

// Sort option state
export const sortOption = atom<SortOption>('price-asc');

// Filter providers based on current filters
export function filterProviders(providers: Provider[]): Provider[] {
  const currentFilters = filters.get();
  
  return providers.filter(provider => {
    // Speed filters
    if (currentFilters.speed.download.min && provider.speed.download < currentFilters.speed.download.min) return false;
    if (currentFilters.speed.download.max && provider.speed.download > currentFilters.speed.download.max) return false;
    if (currentFilters.speed.upload.min && provider.speed.upload < currentFilters.speed.upload.min) return false;
    if (currentFilters.speed.upload.max && provider.speed.upload > currentFilters.speed.upload.max) return false;

    // Price filters
    if (currentFilters.price.monthly.min && provider.price.monthly < currentFilters.price.monthly.min) return false;
    if (currentFilters.price.monthly.max && provider.price.monthly > currentFilters.price.monthly.max) return false;

    // Feature filters
    if (currentFilters.features.hasSetupFee && !provider.features.hasSetupFee) return false;
    if (currentFilters.features.hasEdevlet && !provider.features.hasEdevlet) return false;
    if (currentFilters.features.isPrepaid && !provider.features.isPrepaid) return false;
    if (currentFilters.features.hasCommitment && !provider.features.hasCommitment) return false;
    if (currentFilters.features.includesModem && !provider.features.includesModem) return false;

    return true;
  });
}

// Sort providers based on current sort option
export function sortProviders(providers: Provider[]): Provider[] {
  const currentSort = sortOption.get();
  
  return [...providers].sort((a, b) => {
    switch (currentSort) {
      case 'price-asc':
        return a.price.monthly - b.price.monthly;
      case 'price-desc':
        return b.price.monthly - a.price.monthly;
      case 'speed-asc':
        return a.speed.download - b.speed.download;
      case 'speed-desc':
        return b.speed.download - a.speed.download;
      default:
        return 0;
    }
  });
}

// Reset filters to initial state
export function resetFilters() {
  filters.set({
    speed: {
      download: { min: null, max: null },
      upload: { min: null, max: null },
    },
    price: {
      monthly: { min: null, max: null },
    },
    features: {
      hasSetupFee: false,
      hasEdevlet: false,
      isPrepaid: false,
      hasCommitment: false,
      includesModem: false,
    },
  });
  sortOption.set('price-asc');
}
