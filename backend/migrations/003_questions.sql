CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    required INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS choice_questions (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    options TEXT NOT NULL, -- json array of strs
    answer INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS text_questions (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkbox_questions (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    options TEXT NOT NULL, -- json array of strs
    answer TEXT NOT NULL -- json array of indices
);

CREATE TABLE IF NOT EXISTS number_questions (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    min REAL,
    max REAL,
    answer REAL NOT NULL
);
