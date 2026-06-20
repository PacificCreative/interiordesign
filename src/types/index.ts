export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  budget?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  coverImage?: string | null;
  style?: string | null;
  colorPalette?: string | null;
  userId: string;
  clientId?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client | null;
  rooms?: Room[];
  tasks?: Task[];
  moodBoards?: MoodBoard[];
  products?: Product[];
  invoices?: Invoice[];
}

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
  avatarUrl?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  roomType?: string | null;
  dimensions?: string | null;
  notes?: string | null;
  order: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  completedAt?: string | null;
  order: number;
  projectId: string;
  roomId?: string | null;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  brand?: string | null;
  vendorName?: string | null;
  retailPrice?: number | null;
  tradePrice?: number | null;
  currency: string;
  url?: string | null;
  imageUrl?: string | null;
  specifications?: string | null;
  notes?: string | null;
  status: ProductStatus;
  quantity: number;
  projectId: string;
  roomId?: string | null;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'SPECIFIED' | 'QUOTED' | 'ORDERED' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  vendorName?: string | null;
  vendorContact?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  shipping?: number | null;
  total?: number | null;
  currency: string;
  orderDate?: string | null;
  estimatedDelivery?: string | null;
  trackingUrl?: string | null;
  notes?: string | null;
  userId: string;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface MoodBoard {
  id: string;
  name: string;
  description?: string | null;
  layout: string;
  canvasData?: string | null;
  tags?: string | null;
  projectId: string;
  roomId?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: MoodBoardItem[];
}

export interface MoodBoardItem {
  id: string;
  type: string;
  content: string;
  label?: string | null;
  positionX: number;
  positionY: number;
  width?: number | null;
  height?: number | null;
  order: number;
  moodBoardId: string;
  createdAt: string;
}

export interface StyleAssessment {
  id: string;
  name?: string | null;
  responses: string;
  preferences?: string | null;
  styleProfile?: string | null;
  colorPalette?: string | null;
  notes?: string | null;
  userId: string;
  projectId?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  description?: string | null;
  amount: number;
  taxRate?: number | null;
  total: number;
  currency: string;
  dueDate?: string | null;
  paidAt?: string | null;
  stripeInvoiceId?: string | null;
  stripePaymentIntentId?: string | null;
  notes?: string | null;
  userId: string;
  projectId?: string | null;
  clientId?: string | null;
  createdAt: string;
  updatedAt: string;
  lineItems?: InvoiceLineItem[];
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}