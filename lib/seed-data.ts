import type {
  Material,
  Supplier,
  PurchaseOrder,
  StockRequest,
  SupplyRequest,
  InwardRecord,
  OutwardRecord,
  AuditEntry,
} from "./types";

export const COMPANY_NAME = "Vijaya Electronics";
export const COMPANY_ADDRESS = "Plot 45, Industrial Estate, Hyderabad, Telangana - 500051";

export const suppliers: Supplier[] = [
  {
    id: "SUP-A",
    companyName: "RS Electronics",
    contactPerson: "Ramesh Sharma",
    email: "rs@electronics.com",
    phone: "+91-9876543210",
    address: "Plot 12, Industrial Area, Bengaluru, Karnataka",
    rating: 4.5,
    avgResponseTimeHours: 6,
  },
  {
    id: "SUP-B",
    companyName: "Premier Farnell",
    contactPerson: "Priya Nair",
    email: "contact@farnell.com",
    phone: "+91-9876543211",
    address: "Sector 8, Electronic City, Pune, Maharashtra",
    rating: 4.2,
    avgResponseTimeHours: 10,
  },
  {
    id: "SUP-C",
    companyName: "TTM Electronics",
    contactPerson: "Karthik Iyer",
    email: "ttm@ttmelectronics.com",
    phone: "+91-9876543212",
    address: "Unit 5, Tech Park, Chennai, Tamil Nadu",
    rating: 4.8,
    avgResponseTimeHours: 4,
  },
];

export const materials: Material[] = [
  {
    id: "MAT-01",
    name: "Resistors (1K, 10K, 100K ohm)",
    category: "Passive Components",
    unit: "units",
    currentStock: 500,
    reorderPoint: 300,
    supplierId: "SUP-A",
  },
  {
    id: "MAT-02",
    name: "Capacitors (10µF, 100µF)",
    category: "Passive Components",
    unit: "units",
    currentStock: 150,
    reorderPoint: 200,
    supplierId: "SUP-B",
  },
  {
    id: "MAT-03",
    name: "LEDs (Red, Green, Blue)",
    category: "Optoelectronics",
    unit: "units",
    currentStock: 1000,
    reorderPoint: 500,
    supplierId: "SUP-A",
  },
  {
    id: "MAT-04",
    name: "Microcontroller (ATmega328)",
    category: "ICs",
    unit: "units",
    currentStock: 20,
    reorderPoint: 10,
    supplierId: "SUP-C",
  },
  {
    id: "MAT-05",
    name: "Crystals (16MHz)",
    category: "Timing",
    unit: "units",
    currentStock: 5,
    reorderPoint: 5,
    supplierId: "SUP-C",
  },
  {
    id: "MAT-06",
    name: "Transistors (NPN, PNP)",
    category: "Semiconductors",
    unit: "units",
    currentStock: 800,
    reorderPoint: 400,
    supplierId: "SUP-B",
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-001",
    clientName: "ABC Electronics",
    clientContact: "Anil Kapoor · +91-9820011223",
    createdDate: "2026-06-20",
    deliveryDate: "2026-07-15",
    status: "in_progress",
    kits: [
      {
        id: "KIT-A",
        name: "Assembly Kit A",
        components: [
          {
            id: "CMP-A1",
            name: "Resistor Pack",
            bom: [{ materialName: "Resistors (1K, 10K, 100K ohm)", qtyRequired: 100, unit: "units" }],
          },
          {
            id: "CMP-A2",
            name: "Capacitor Pack",
            bom: [{ materialName: "Capacitors (10µF, 100µF)", qtyRequired: 50, unit: "units" }],
          },
          {
            id: "CMP-A3",
            name: "LED Array",
            bom: [{ materialName: "LEDs (Red, Green, Blue)", qtyRequired: 200, unit: "units" }],
          },
        ],
      },
      {
        id: "KIT-B",
        name: "Control Kit B",
        components: [
          {
            id: "CMP-B1",
            name: "Microcontroller Unit",
            bom: [{ materialName: "Microcontroller (ATmega328)", qtyRequired: 5, unit: "units" }],
          },
          {
            id: "CMP-B2",
            name: "Timing Circuit",
            bom: [{ materialName: "Crystals (16MHz)", qtyRequired: 5, unit: "units" }],
          },
        ],
      },
    ],
  },
  {
    id: "PO-002",
    poNumber: "PO-002",
    clientName: "XYZ Manufacturing",
    clientContact: "Sunita Rao · +91-9845022334",
    createdDate: "2026-06-25",
    deliveryDate: "2026-07-22",
    status: "pending",
    kits: [
      {
        id: "KIT-C",
        name: "Power Kit C",
        components: [
          {
            id: "CMP-C1",
            name: "Switching Regulator",
            bom: [{ materialName: "Transistors (NPN, PNP)", qtyRequired: 300, unit: "units" }],
          },
          {
            id: "CMP-C2",
            name: "Filter Bank",
            bom: [{ materialName: "Capacitors (10µF, 100µF)", qtyRequired: 120, unit: "units" }],
          },
        ],
      },
      {
        id: "KIT-D",
        name: "Sensor Kit D",
        components: [
          {
            id: "CMP-D1",
            name: "Signal Conditioning",
            bom: [{ materialName: "Resistors (1K, 10K, 100K ohm)", qtyRequired: 250, unit: "units" }],
          },
          {
            id: "CMP-D2",
            name: "Sensor Controller",
            bom: [{ materialName: "Microcontroller (ATmega328)", qtyRequired: 8, unit: "units" }],
          },
        ],
      },
      {
        id: "KIT-E",
        name: "Display Kit E",
        components: [
          {
            id: "CMP-E1",
            name: "Indicator Panel",
            bom: [{ materialName: "LEDs (Red, Green, Blue)", qtyRequired: 400, unit: "units" }],
          },
        ],
      },
    ],
  },
  {
    id: "PO-003",
    poNumber: "PO-003",
    clientName: "Tech Solutions",
    clientContact: "Deepak Verma · +91-9900112233",
    createdDate: "2026-07-01",
    deliveryDate: "2026-07-28",
    status: "draft",
    kits: [
      {
        id: "KIT-F",
        name: "Prototype Kit F",
        components: [
          {
            id: "CMP-F1",
            name: "Voltage Regulator Stage",
            bom: [{ materialName: "Voltage Regulator (LM7805)", qtyRequired: 30, unit: "units" }],
          },
          {
            id: "CMP-F2",
            name: "Base Board",
            bom: [{ materialName: "Resistors (1K, 10K, 100K ohm)", qtyRequired: 60, unit: "units" }],
          },
        ],
      },
    ],
  },
];

export const stockRequests: StockRequest[] = [
  {
    id: "REQ-1001",
    poId: "PO-001",
    poNumber: "PO-001",
    materialId: "MAT-01",
    materialName: "Resistors (1K, 10K, 100K ohm)",
    unit: "units",
    qtyRequested: 100,
    dateRequested: "2026-06-28",
    status: "accepted",
  },
  {
    id: "REQ-1002",
    poId: "PO-001",
    poNumber: "PO-001",
    materialId: "MAT-03",
    materialName: "LEDs (Red, Green, Blue)",
    unit: "units",
    qtyRequested: 200,
    dateRequested: "2026-06-28",
    status: "accepted",
  },
  {
    id: "REQ-1003",
    poId: "PO-001",
    poNumber: "PO-001",
    materialId: "MAT-02",
    materialName: "Capacitors (10µF, 100µF)",
    unit: "units",
    qtyRequested: 50,
    dateRequested: "2026-06-29",
    status: "pending",
  },
  {
    id: "REQ-1004",
    poId: "PO-001",
    poNumber: "PO-001",
    materialId: "MAT-05",
    materialName: "Crystals (16MHz)",
    unit: "units",
    qtyRequested: 5,
    dateRequested: "2026-06-30",
    status: "rejected",
  },
];

export const supplyRequests: SupplyRequest[] = [
  {
    id: "SR-5001",
    materialId: "MAT-02",
    materialName: "Capacitors (10µF, 100µF)",
    unit: "units",
    supplierId: "SUP-B",
    qtyRequested: 500,
    urgency: "Urgent",
    dateRequested: "2026-07-02",
    requestedDeliveryDate: "2026-07-09",
    status: "requested",
  },
];

export const inwardRecords: InwardRecord[] = [
  {
    id: "IN-9001",
    materialId: "MAT-01",
    materialName: "Resistors (1K, 10K, 100K ohm)",
    unit: "units",
    qty: 1000,
    date: "2026-06-10",
    supplierId: "SUP-A",
    supplierName: "RS Electronics",
  },
  {
    id: "IN-9002",
    materialId: "MAT-06",
    materialName: "Transistors (NPN, PNP)",
    unit: "units",
    qty: 500,
    date: "2026-06-15",
    supplierId: "SUP-B",
    supplierName: "Premier Farnell",
  },
];

export const outwardRecords: OutwardRecord[] = [
  {
    id: "OUT-8001",
    materialId: "MAT-01",
    materialName: "Resistors (1K, 10K, 100K ohm)",
    unit: "units",
    qty: 100,
    date: "2026-06-29",
    poId: "PO-001",
    poNumber: "PO-001",
  },
  {
    id: "OUT-8002",
    materialId: "MAT-03",
    materialName: "LEDs (Red, Green, Blue)",
    unit: "units",
    qty: 200,
    date: "2026-06-29",
    poId: "PO-001",
    poNumber: "PO-001",
  },
];

export const initialAuditLog: AuditEntry[] = [
  { id: "AUD-1", timestamp: "2026-06-29 10:14", message: "Stock issued: 100 units Resistors for PO-001" },
  { id: "AUD-2", timestamp: "2026-06-29 10:16", message: "Stock issued: 200 units LEDs for PO-001" },
  { id: "AUD-3", timestamp: "2026-07-02 09:05", message: "Supply requested from Premier Farnell for Capacitors (10µF, 100µF)" },
];
