# Phase 3: Cart + Order Management — Implementation Plan

**Goal:** Implement full shopping cart and order management with database transactions.

**Architecture:** Cart module (per-user cart with items), Order module (create from cart with transactional rollback). Orders store snapshots of product data at purchase time.

**Tech Stack:** NestJS, TypeORM (transactions), QueryRunner for order creation.

---

### Task 3.1: Cart + CartItem Entities

**Files:**
- Create: `back-end/src/modules/cart/entities/cart.entity.ts`
- Create: `back-end/src/modules/cart/entities/cart-item.entity.ts`
- Modify: `back-end/src/app.module.ts`

Cart entity: user-based, 1 cart per user (unique userId)
CartItem entity: links Cart, Product, optional Variant, quantity. Unique constraint on [cartId, productId, variantId]

### Task 3.2: Cart Module (Service + Controller + DTOs)

- CRUD cart items (add, update quantity, remove, clear)
- Auto-calculate totals
- Create cart on first item addition

### Task 3.3: Order + OrderItem Entities

**Files:**
- Create: `back-end/src/modules/order/entities/order.entity.ts`
- Create: `back-end/src/modules/order/entities/order-item.entity.ts`

Order: user, status, totalPrice, shippingFee, addressSnapshot (JSON), payment tracking
OrderItem: snapshot of product name, image, price at purchase

### Task 3.4: Order Module (Service + Controller + DTOs)

- Create order from cart with TypeORM transaction (QueryRunner)
- Deduct inventory (product quantity) within transaction
- List user orders (paginated), order detail
- Cancel order (only PENDING)

### Task 3.5: Frontend — Cart Page

- CartPage with CartItem list + CartSummary
- Quantity update, item removal
- Cart badge on Header

### Task 3.6: Frontend — Checkout + Orders + Order Detail Pages

- CheckoutPage: address selection, order summary, place order
- OrdersPage: list of user orders
- OrderDetailPage: full order details

### Task 3.7: Frontend — Router Updates + Store

- Cart store (Zustand)
- Add routes for cart, checkout, orders, order detail
- Link "Thêm vào giỏ hàng" button from ProductDetailPage
