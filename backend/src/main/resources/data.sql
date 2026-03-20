INSERT INTO users (name, email, created_at)
SELECT 'Default Admin', 'admin@designflow.in', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@designflow.in'
);

INSERT INTO material_rates (category, material, default_rate_per_sqft, created_at)
SELECT 'wardrobe', 'laminate', 450.00, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM material_rates WHERE material = 'laminate'
);

INSERT INTO material_rates (category, material, default_rate_per_sqft, created_at)
SELECT 'kitchen', 'acrylic', 650.00, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM material_rates WHERE material = 'acrylic'
);

INSERT INTO material_rates (category, material, default_rate_per_sqft, created_at)
SELECT 'cabinet', 'plywood', 520.00, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM material_rates WHERE material = 'plywood'
);

INSERT INTO material_rates (category, material, default_rate_per_sqft, created_at)
SELECT 'tv unit', 'veneer', 780.00, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM material_rates WHERE material = 'veneer'
);
