# Бэкенд для приложения Flashcards

[Код фронтенда тут](https://github.com/David-Vanuxin/flashcards)

## Запуск
1. `sqlite3 prod.db`
2. Создайте таблицы ```
CREATE TABLE Modules(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL);
	CREATE TABLE sqlite_sequence(name,seq);

CREATE TABLE Terms(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	answer TEXT NOT NULL,
	question TEXT NOT NULL,
	module INTEGER NOT NULL,
	FOREIGN KEY(module) REFERENCES Modules(id));```

3. `export prod.db`
4. `npm run start`