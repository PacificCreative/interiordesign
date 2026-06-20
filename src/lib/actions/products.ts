'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api';

// ─── Products ───────────────────────────────────────────────────────────────

export async function createProduct(data: {
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  brand?: string;
  vendorName?: string;
  retailPrice?: number;
  tradePrice?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
  specifications?: string;
  notes?: string;
  quantity?: number;
  projectId: string;
  roomId?: string;
}) {
  const userId = await requireAuth();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description || null,
      sku: data.sku || null,
      category: data.category || null,
      brand: data.brand || null,
      vendorName: data.vendorName || null,
      retailPrice: data.retailPrice || null,
      tradePrice: data.tradePrice || null,
      currency: data.currency || 'USD',
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      specifications: data.specifications || null,
      notes: data.notes || null,
      quantity: data.quantity || 1,
      projectId: data.projectId,
      roomId: data.roomId || null,
    },
    include: {
      project: { select: { name: true } },
      room: { select: { name: true } },
    },
  });

  revalidatePath('/products');
  revalidatePath(`/projects/${data.projectId}`);
  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    sku: string;
    category: string;
    brand: string;
    vendorName: string;
    retailPrice: number;
    tradePrice: number;
    currency: string;
    url: string;
    imageUrl: string;
    specifications: string;
    status: string;
    notes: string;
    quantity: number;
    roomId: string;
  }>
) {
  await requireAuth();

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.vendorName !== undefined && { vendorName: data.vendorName }),
      ...(data.retailPrice !== undefined && { retailPrice: data.retailPrice }),
      ...(data.tradePrice !== undefined && { tradePrice: data.tradePrice }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.specifications !== undefined && { specifications: data.specifications }),
      ...(data.status !== undefined && { status: data.status as any }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.roomId !== undefined && { roomId: data.roomId }),
    },
  });

  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  return product;
}

export async function deleteProduct(id: string) {
  await requireAuth();
  await prisma.product.delete({ where: { id } });
  revalidatePath('/products');
  return { success: true };
}

export async function getProduct(id: string) {
  await requireAuth();

  return prisma.product.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      room: { select: { id: true, name: true } },
      order: { select: { id: true, orderNumber: true, status: true } },
    },
  });
}

export async function getProducts(options?: {
  search?: string;
  category?: string;
  status?: string;
  projectId?: string;
  roomId?: string;
  vendorName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  await requireAuth();

  const where: any = {};

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { brand: { contains: options.search, mode: 'insensitive' } },
      { vendorName: { contains: options.search, mode: 'insensitive' } },
      { sku: { contains: options.search, mode: 'insensitive' } },
    ];
  }
  if (options?.category) where.category = options.category;
  if (options?.status) where.status = options.status;
  if (options?.projectId) where.projectId = options.projectId;
  if (options?.roomId) where.roomId = options.roomId;
  if (options?.vendorName) where.vendorName = options.vendorName;

  const orderBy: any = {};
  if (options?.sortBy) {
    orderBy[options.sortBy] = options.sortOrder || 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return prisma.product.findMany({
    where,
    include: {
      project: { select: { name: true } },
      room: { select: { name: true } },
    },
    orderBy,
  });
}

export async function getProductCategories() {
  await requireAuth();
  const result = await prisma.product.findMany({
    select: { category: true },
    where: { category: { not: null } },
    distinct: ['category'],
  });
  return result.map((r) => r.category).filter(Boolean) as string[];
}

export async function getVendors() {
  await requireAuth();
  const result = await prisma.product.findMany({
    select: { vendorName: true },
    where: { vendorName: { not: null } },
    distinct: ['vendorName'],
  });
  return result.map((r) => r.vendorName).filter(Boolean) as string[];
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(data: {
  vendorName?: string;
  vendorContact?: string;
  notes?: string;
  projectId?: string;
  productIds: string[];
}) {
  const userId = await requireAuth();

  const count = await prisma.order.count();
  const orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      vendorName: data.vendorName || null,
      vendorContact: data.vendorContact || null,
      notes: data.notes || null,
      projectId: data.projectId || null,
      userId,
      products: {
        connect: data.productIds.map((id) => ({ id })),
      },
    },
    include: {
      products: {
        select: { id: true, name: true, retailPrice: true, tradePrice: true },
      },
    },
  });

  // Update product statuses to ORDERED
  await prisma.product.updateMany({
    where: { id: { in: data.productIds } },
    data: { status: 'ORDERED', orderId: order.id },
  });

  revalidatePath('/orders');
  revalidatePath('/products');
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  data?: { trackingUrl?: string; estimatedDelivery?: string }
) {
  await requireAuth();

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: status as any,
      ...(data?.trackingUrl && { trackingUrl: data.trackingUrl }),
      ...(data?.estimatedDelivery && {
        estimatedDelivery: new Date(data.estimatedDelivery),
      }),
      ...(status === 'DELIVERED' && { orderDate: new Date() }),
    },
  });

  // Update product statuses
  if (status === 'DELIVERED') {
    await prisma.product.updateMany({
      where: { orderId: id },
      data: { status: 'DELIVERED' },
    });
  }

  revalidatePath('/orders');
  return order;
}

export async function getOrders() {
  await requireAuth();

  return prisma.order.findMany({
    include: {
      products: {
        select: { id: true, name: true, retailPrice: true, status: true },
      },
      project: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrder(id: string) {
  await requireAuth();

  return prisma.order.findUnique({
    where: { id },
    include: {
      products: true,
      project: { select: { id: true, name: true } },
    },
  });
}

// ─── Products by Project ────────────────────────────────────────────────────

export async function getProjectProducts(projectId: string) {
  await requireAuth();

  return prisma.product.findMany({
    where: { projectId },
    include: {
      room: { select: { name: true } },
      order: { select: { orderNumber: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}