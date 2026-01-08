-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    role_id UUID REFERENCES roles(id),
    department VARCHAR(100),
    designation VARCHAR(100),
    description TEXT,
    country VARCHAR(100),
    gender VARCHAR(50),
    agent_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    stock_status VARCHAR(50),
    image_url TEXT,
    discount_percentage VARCHAR(10),
    sold_count INT DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50),
    user_id UUID REFERENCES users(id),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50),
    total_amount DECIMAL(10, 2)
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- Transactions (Commerce)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method VARCHAR(50)
);

-- Tasks (CRM)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    assigned_to_user_id UUID REFERENCES users(id),
    due_date DATE,
    status VARCHAR(50),
    priority VARCHAR(50)
);

-- Expense Categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color_code VARCHAR(50)
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    category_id UUID REFERENCES expense_categories(id),
    title VARCHAR(255),
    amount DECIMAL(10, 2),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns (Marketing)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(50),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
);

-- Campaign Analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE,
    reach_count INT DEFAULT 0,
    conversion_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    cost_spent DECIMAL(10, 2) DEFAULT 0
);

-- Assets (Investment)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    current_price DECIMAL(20, 8),
    image_url TEXT
);

-- User Assets (Portfolio)
CREATE TABLE IF NOT EXISTS user_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_id UUID REFERENCES assets(id),
    quantity_owned DECIMAL(20, 8) DEFAULT 0,
    average_buy_price DECIMAL(20, 8),
    total_value_current DECIMAL(20, 8)
);

-- Investment Transactions
CREATE TABLE IF NOT EXISTS investment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_id UUID REFERENCES assets(id),
    type VARCHAR(50), -- buy, sell
    quantity DECIMAL(20, 8),
    price_at_transaction DECIMAL(20, 8),
    total_amount DECIMAL(20, 8),
    status VARCHAR(50),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_name VARCHAR(255),
    author_image_url TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Projects
CREATE TABLE IF NOT EXISTS investment_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    name VARCHAR(255),
    duration_months INT,
    stock_level_percentage DECIMAL(5, 2),
    status VARCHAR(50)
);

-- Crypto Wallets
CREATE TABLE IF NOT EXISTS crypto_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    currency VARCHAR(20),
    address VARCHAR(255),
    balance DECIMAL(20, 8) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active'
);

-- Crypto Transactions
CREATE TABLE IF NOT EXISTS crypto_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES crypto_wallets(id),
    type VARCHAR(50),
    amount_crypto DECIMAL(20, 8),
    amount_fiat DECIMAL(20, 2),
    transaction_hash VARCHAR(255),
    counterparty_address VARCHAR(255),
    status VARCHAR(50),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Cards
CREATE TABLE IF NOT EXISTS credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    card_alias VARCHAR(100),
    last_four VARCHAR(4),
    holder_name VARCHAR(255),
    expiry_date DATE,
    card_bg_style VARCHAR(100)
);

-- NFT Collections
CREATE TABLE IF NOT EXISTS nft_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    creator_name VARCHAR(255),
    cover_image_url TEXT,
    items_count INT DEFAULT 0
);

-- NFT Items
CREATE TABLE IF NOT EXISTS nft_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES nft_collections(id),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255),
    image_url TEXT,
    price_eth DECIMAL(20, 8),
    price_usd DECIMAL(10, 2),
    category VARCHAR(50),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT Bids
CREATE TABLE IF NOT EXISTS nft_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_item_id UUID REFERENCES nft_items(id),
    bidder_user_id UUID REFERENCES users(id),
    bid_amount_eth DECIMAL(20, 8),
    bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50)
);

-- NFT Creators
CREATE TABLE IF NOT EXISTS nft_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    bio TEXT,
    total_sales_value DECIMAL(20, 8),
    followers_count INT,
    cover_image_url TEXT
);

-- Medical Departments
CREATE TABLE IF NOT EXISTS medical_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    head_doctor_id UUID -- Circular dependency reference handled carefully or deferred
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    department_id UUID REFERENCES medical_departments(id),
    specialization VARCHAR(100),
    joined_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50)
);

-- Update Medical Departments Head Doctor FK
ALTER TABLE medical_departments ADD CONSTRAINT fk_head_doctor FOREIGN KEY (head_doctor_id) REFERENCES doctors(id);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(50),
    phone VARCHAR(50),
    address TEXT,
    admitted_at TIMESTAMP WITH TIME ZONE,
    last_visited_dept_id UUID REFERENCES medical_departments(id)
);

-- Medical Appointments
CREATE TABLE IF NOT EXISTS medical_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    department_id UUID REFERENCES medical_departments(id),
    appointment_date TIMESTAMP WITH TIME ZONE,
    fee DECIMAL(10, 2),
    status VARCHAR(50),
    type VARCHAR(100)
);

-- Medicines
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    stock_quantity INT,
    price DECIMAL(10, 2),
    expiry_date DATE
);

-- Analytics Daily Metrics
CREATE TABLE IF NOT EXISTS analytics_daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(10, 2),
    total_sales DECIMAL(10, 2),
    profit DECIMAL(10, 2),
    loss DECIMAL(10, 2),
    total_visitors INT,
    refunded_count INT
);

-- Traffic Sources
CREATE TABLE IF NOT EXISTS traffic_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL,
    visitor_count INT DEFAULT 0,
    date DATE
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    response_time_minutes INT
);

-- Payment Transactions (Generic)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    provider VARCHAR(50),
    type VARCHAR(50),
    amount DECIMAL(10, 2),
    direction VARCHAR(20),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_info TEXT,
    total_supplied_value DECIMAL(10, 2)
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10, 2),
    status VARCHAR(50)
);

-- Inventory Transactions (Stock movement)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    type VARCHAR(20), -- in, out
    quantity INT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS Sales
CREATE TABLE IF NOT EXISTS pos_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id), -- Seller
    customer_id UUID REFERENCES users(id), -- Buyer (optional)
    total_amount DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method VARCHAR(50)
);

-- Debt Records
CREATE TABLE IF NOT EXISTS debt_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    total_amount DECIMAL(10, 2),
    paid_amount DECIMAL(10, 2),
    due_amount DECIMAL(10, 2),
    due_date DATE,
    status VARCHAR(50)
);

-- Financial Beneficiaries
CREATE TABLE IF NOT EXISTS financial_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    role VARCHAR(100),
    image_url TEXT,
    account_details TEXT
);

-- Recurring Bills
CREATE TABLE IF NOT EXISTS recurring_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    amount DECIMAL(10, 2),
    due_date DATE,
    frequency VARCHAR(50),
    status VARCHAR(50)
);

-- Saving Goals
CREATE TABLE IF NOT EXISTS saving_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    target_amount DECIMAL(10, 2),
    current_amount DECIMAL(10, 2),
    icon_url TEXT,
    bg_color VARCHAR(50)
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50),
    user_id UUID REFERENCES users(id),
    client_name VARCHAR(255),
    client_address TEXT,
    client_phone VARCHAR(50),
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    subtotal DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    sales_agent_id UUID REFERENCES users(id)
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_name VARCHAR(255),
    unit VARCHAR(20),
    quantity INT,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2)
);
