CREATE TABLE public.user_recipes (
    user_id INTEGER,
    recipe_name VARCHAR(255),
    ingredients TEXT,
    instructions TEXT,
    difficulty VARCHAR(50),
    time_required VARCHAR(50),
    description TEXT,
    PRIMARY KEY (user_id, recipe_name)
);
