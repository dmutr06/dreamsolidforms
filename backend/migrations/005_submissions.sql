CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    user_id TEXT, 
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS choice_answers (
    id TEXT PRIMARY KEY,
    answer_id TEXT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS text_answers (
    id TEXT PRIMARY KEY,
    answer_id TEXT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkbox_answers (
    id TEXT PRIMARY KEY,
    answer_id TEXT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    value TEXT NOT NULL -- json array of indices
);

CREATE TABLE IF NOT EXISTS number_answers (
    id TEXT PRIMARY KEY,
    answer_id TEXT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    value REAL NOT NULL
);
