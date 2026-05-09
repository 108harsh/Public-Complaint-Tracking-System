-- Users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen','admin','staff')),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  description TEXT
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  location_id SERIAL PRIMARY KEY,
  area VARCHAR(150),
  street VARCHAR(200),
  city VARCHAR(100),
  pincode VARCHAR(20),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6)
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  dept_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact_email VARCHAR(150),
  head_name VARCHAR(100)
);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
  complaint_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  category_id INT REFERENCES categories(category_id),
  location_id INT REFERENCES locations(location_id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(30) DEFAULT 'pending' 
    CHECK (status IN ('pending','assigned','in_progress','resolved','rejected')),
  priority VARCHAR(20) DEFAULT 'normal' 
    CHECK (priority IN ('low','normal','high','urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaint Assignment
CREATE TABLE IF NOT EXISTS complaint_assignment (
  assignment_id SERIAL PRIMARY KEY,
  complaint_id INT REFERENCES complaints(complaint_id),
  dept_id INT REFERENCES departments(dept_id),
  assigned_by INT REFERENCES users(user_id),
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status Logs
CREATE TABLE IF NOT EXISTS status_logs (
  log_id SERIAL PRIMARY KEY,
  complaint_id INT REFERENCES complaints(complaint_id),
  changed_by INT REFERENCES users(user_id),
  old_status VARCHAR(30),
  new_status VARCHAR(30),
  note TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed data for categories
INSERT INTO categories (name, icon, description) 
VALUES 
  ('Roads & Potholes', 'map-pin', 'Issues related to road conditions and potholes.'),
  ('Garbage & Sanitation', 'trash', 'Issues related to waste management and cleanliness.'),
  ('Water Supply', 'droplet', 'Issues with water availability and quality.'),
  ('Electricity', 'zap', 'Power outages and electrical grid issues.'),
  ('Street Lighting', 'lightbulb', 'Broken or missing street lights.')
ON CONFLICT DO NOTHING;
