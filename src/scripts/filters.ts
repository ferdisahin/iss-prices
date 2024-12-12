// DOM Elements için type tanımlamaları
type ProviderCardElement = HTMLDivElement & {
  dataset: {
    price: string;
    speed: string;
    hasSetupFee: string;
    hasEdevlet: string;
    isPrepaid: string;
    hasCommitment: string;
    includesModem: string;
  };
};

// Initialize filter inputs
document.addEventListener('DOMContentLoaded', () => {
  // Filter state
  let filters = {
    download: null as number | null,
    upload: null as number | null,
    price: {
      min: null as number | null,
      max: null as number | null
    },
    features: {
      setupFee: false,
      edevlet: false,
      prepaid: false,
      commitment: false,
      modem: false
    }
  };

  // Event listeners for filters
  const downloadSpeedInput = document.getElementById("download-speed") as HTMLInputElement;
  const uploadSpeedInput = document.getElementById("upload-speed") as HTMLInputElement;
  const priceMinInput = document.getElementById("price-min") as HTMLInputElement;
  const priceMaxInput = document.getElementById("price-max") as HTMLInputElement;

  // Feature toggles
  const featureToggles = {
    "setup-fee": "setupFee",
    "edevlet": "edevlet",
    "prepaid": "prepaid",
    "commitment": "commitment",
    "modem": "modem"
  } as const;

  // Add event listeners
  downloadSpeedInput?.addEventListener("input", (e) => {
    filters.download = (e.target as HTMLInputElement).value ? parseFloat((e.target as HTMLInputElement).value) : null;
    updateFilters();
  });

  uploadSpeedInput?.addEventListener("input", (e) => {
    filters.upload = (e.target as HTMLInputElement).value ? parseFloat((e.target as HTMLInputElement).value) : null;
    updateFilters();
  });

  priceMinInput?.addEventListener("input", (e) => {
    filters.price.min = (e.target as HTMLInputElement).value ? parseFloat((e.target as HTMLInputElement).value) : null;
    updateFilters();
  });

  priceMaxInput?.addEventListener("input", (e) => {
    filters.price.max = (e.target as HTMLInputElement).value ? parseFloat((e.target as HTMLInputElement).value) : null;
    updateFilters();
  });

  // Add feature toggle listeners
  Object.entries(featureToggles).forEach(([id, key]) => {
    const toggle = document.getElementById(id) as HTMLInputElement;
    toggle?.addEventListener("change", (e) => {
      filters.features[key as keyof typeof filters.features] = (e.target as HTMLInputElement).checked;
      updateFilters();
    });
  });

  // Update filters
  function updateFilters() {
    const providerCards = document.querySelectorAll(".provider-card") as NodeListOf<HTMLElement>;
    let visibleCount = 0;

    providerCards.forEach(card => {
      const downloadSpeed = parseInt(card.getAttribute("data-download-speed") || "0");
      const uploadSpeed = parseInt(card.getAttribute("data-upload-speed") || "0");
      const price = parseFloat(card.getAttribute("data-price") || "0");
      const setupFee = card.getAttribute("data-setup-fee") === "true";
      const edevlet = card.getAttribute("data-edevlet") === "true";
      const prepaid = card.getAttribute("data-prepaid") === "true";
      const commitment = card.getAttribute("data-commitment") === "true";
      const modem = card.getAttribute("data-modem") === "true";

      let isVisible = true;

      // Speed filters
      if (filters.download !== null && downloadSpeed < filters.download) {
        isVisible = false;
      }
      if (filters.upload !== null && uploadSpeed < filters.upload) {
        isVisible = false;
      }

      // Price filters
      if (filters.price.min !== null && price < filters.price.min) {
        isVisible = false;
      }
      if (filters.price.max !== null && price > filters.price.max) {
        isVisible = false;
      }

      // Feature filters
      if (filters.features.setupFee && setupFee) isVisible = false;
      if (filters.features.edevlet && !edevlet) isVisible = false;
      if (filters.features.prepaid && !prepaid) isVisible = false;
      if (filters.features.commitment && commitment) isVisible = false;
      if (filters.features.modem && !modem) isVisible = false;

      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    });

    // Update visible count
    const visibleCountElement = document.getElementById("visible-count");
    if (visibleCountElement) {
      visibleCountElement.textContent = `${visibleCount} paket`;
    }

    // Update pagination
    const event = new CustomEvent("filtersUpdated", { detail: { visibleCount } });
    document.dispatchEvent(event);
  }

  // Reset filters
  window.resetFilters = () => {
    // Reset filter state
    filters = {
      download: null,
      upload: null,
      price: {
        min: null,
        max: null
      },
      features: {
        setupFee: false,
        edevlet: false,
        prepaid: false,
        commitment: false,
        modem: false
      }
    };

    // Reset input values
    const numberInputs = document.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;
    numberInputs.forEach((input) => {
      input.value = '';
    });

    // Reset checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Show all providers and update UI
    updateFilters();
  }
});
