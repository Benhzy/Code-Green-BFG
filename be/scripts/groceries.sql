CREATE TABLE public.groceries (
    user_id INTEGER,
    item VARCHAR(255),
    quantity INTEGER,
    category VARCHAR(50),
    purchase_date DATE,
    expiry_date DATE,
    PRIMARY KEY (user_id, item, purchase_date)
);
