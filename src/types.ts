export type HeaderField = {
  label: string;
  value: string;
  placeholder: string;
  labelPlaceholder: string;
};

export type AppState = {
  identifier: string;
  version: string;
  sidebarOpen: boolean;
  previewMode: boolean;
  currency: {
    name: string;
    value: string;
  };
  taxRate: number | null;
  taxEnabled: boolean;
  logo: string | null;
  businessName: string;
  businessHeaderFreeText: string;
  headerFields: HeaderField[];
  invoiceSubheader: string;
  invoiceSubheaderFreeText: string;
  notesLabel: string;
  notesFreeText: string;
  lineItems: InvoiceLineItem[];
  showQuantity: boolean;
  showPrice: boolean;
  showSubtotal: boolean;
  showTax: boolean;
};

export type InvoiceLineItem = {
  name: string;
  description: string;
  quantity?: number;
  price?: number;
  cost?: number;
};
