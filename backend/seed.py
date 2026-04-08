import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/careerverse")

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def seed():
    from app.models.zone import Zone
    from app.models.profession import Profession
    from app.models.character import Character
    from app.models.level import Level
    from app.models.task import Task
    from sqlalchemy import select, text

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        result = await db.execute(select(Zone))
        if result.scalars().first():
            print("Already seeded, skipping.")
            return

        # Zones
        zone_it = Zone(name="IT и технологии", color_code="#3B82F6", icon_emoji="🔵", is_locked_free=False)
        zone_med = Zone(name="Медицина", color_code="#22C55E", icon_emoji="🟢", is_locked_free=True)
        db.add_all([zone_it, zone_med])
        await db.flush()

        # Professions
        prof_fe = Profession(
            name="Frontend-разработчик", zone_id=zone_it.id, difficulty=3,
            description="Создавай красивые веб-интерфейсы с помощью HTML, CSS и JavaScript. Frontend-разработчики делают интернет красивым и удобным.",
            chibi_emoji="💻"
        )
        prof_doc = Profession(
            name="Врач общей практики", zone_id=zone_med.id, difficulty=4,
            description="Помогай людям оставаться здоровыми. Врач — одна из самых благородных профессий в мире.",
            chibi_emoji="👨‍⚕️"
        )
        db.add_all([prof_fe, prof_doc])
        await db.flush()

        # Characters
        char_fe = Character(profession_id=prof_fe.id, sprite_url="/sprites/frontend_dev.png", name="Алексей Кодеров")
        char_doc = Character(profession_id=prof_doc.id, sprite_url="/sprites/doctor.png", name="Айгуль Медикова")
        db.add_all([char_fe, char_doc])

        # Levels for Frontend
        levels_data = [
            {
                "order_index": 1, "title": "Знакомство с HTML", "type": "quiz",
                "teaching_text": """# Добро пожаловать в мир HTML! 🌐

HTML (HyperText Markup Language) — это язык разметки, который используется для создания структуры веб-страниц.

## Основные теги HTML:

**Заголовки** — для создания заголовков разных уровней:
- `<h1>` — самый крупный заголовок (главный)
- `<h2>` — заголовок второго уровня
- `<h3>` — заголовок третьего уровня

**Параграфы** — тег `<p>` создаёт абзац текста.

**Ссылки** — тег `<a href="...">` создаёт кликабельную ссылку.

Каждая HTML-страница начинается с `<html>`, содержит `<head>` (служебная информация) и `<body>` (видимый контент).

💡 **Запомни:** Тег `<h1>` используется один раз на странице для главного заголовка!""",
                "task": {
                    "question": "Какой тег создаёт заголовок первого уровня?",
                    "options": ["<h1>", "<head>", "<title>", "<p>"],
                    "correct_answer": "<h1>",
                    "explanation": "<h1> — самый крупный заголовок. Используется один раз на странице для главного заголовка."
                }
            },
            {
                "order_index": 2, "title": "Первый CSS-стиль", "type": "choice",
                "teaching_text": """# CSS — делаем страницу красивой! 🎨

CSS (Cascading Style Sheets) — это язык стилей, который отвечает за внешний вид HTML-элементов.

## Как применить CSS:

```css
p {
    color: red;
    font-size: 16px;
}
```

## Основные свойства:

| Свойство | Что делает |
|----------|-----------|
| `color` | Цвет текста |
| `background-color` | Цвет фона |
| `font-size` | Размер шрифта |
| `margin` | Внешний отступ |
| `padding` | Внутренний отступ |

💡 **Важно:** Свойство для цвета текста называется именно `color`, а не `text-color` или `font-color`!""",
                "task": {
                    "question": "Как изменить цвет текста в CSS?",
                    "options": ["color: red;", "text-color: red;", "font-color: red;", "style: red;"],
                    "correct_answer": "color: red;",
                    "explanation": "Свойство color отвечает за цвет текста. Другие варианты не существуют в CSS."
                }
            },
            {
                "order_index": 3, "title": "Макет на Flexbox", "type": "quiz",
                "teaching_text": """# Flexbox — магия вёрстки! 📐

Flexbox — мощный инструмент CSS для создания гибких макетов.

## Как включить Flexbox:

```css
.container {
    display: flex;
}
```

## Основные свойства:

**justify-content** — выравнивание по горизонтали:
- `flex-start` — элементы в начале
- `center` — по центру
- `space-between` — равномерно с пробелами

**align-items** — выравнивание по вертикали:
- `flex-start` — сверху
- `center` — по центру
- `flex-end` — снизу

**flex-direction** — направление элементов:
- `row` — в строку (по умолчанию)
- `column` — в колонку

💡 **Совет:** Flexbox решает 90% задач по расположению элементов на странице!""",
                "task": {
                    "question": "Какое свойство CSS включает режим Flexbox?",
                    "options": ["display: flex;", "flex: enable;", "layout: flex;", "flexbox: on;"],
                    "correct_answer": "display: flex;",
                    "explanation": "Свойство display: flex; включает Flexbox на родительском элементе, позволяя управлять расположением дочерних элементов."
                }
            },
            {
                "order_index": 4, "title": "Дебаггинг ошибки", "type": "timed",
                "teaching_text": """# Дебаггинг — искусство поиска ошибок! 🔍

Каждый разработчик сталкивается с ошибками. Умение их находить и исправлять — ключевой навык!

## Инструменты разработчика (DevTools):

Нажми **F12** в браузере, чтобы открыть DevTools.

## Типичные ошибки JavaScript:

```javascript
// ❌ Ошибка: переменная не объявлена
console.log(myVar); // ReferenceError

// ✅ Правильно:
let myVar = "Hello";
console.log(myVar);
```

## Как читать ошибки:

1. **TypeError** — неправильный тип данных
2. **ReferenceError** — переменная не объявлена
3. **SyntaxError** — ошибка синтаксиса

## Процесс дебаггинга:

1. Прочитай сообщение об ошибке
2. Найди строку с ошибкой
3. Проверь типы данных
4. Используй `console.log()` для отладки

⏱️ **Внимание:** У тебя 30 секунд на ответ!""",
                "task": {
                    "question": "Какой инструмент браузера используется для дебаггинга JavaScript?",
                    "options": ["DevTools (F12)", "Notepad", "Task Manager", "File Explorer"],
                    "correct_answer": "DevTools (F12)",
                    "explanation": "DevTools — встроенный инструмент браузера (открывается по F12), который позволяет просматривать ошибки, отлаживать JavaScript и изучать HTML/CSS."
                }
            },
            {
                "order_index": 5, "title": "Код-ревью от тимлида", "type": "choice",
                "teaching_text": """# Код-ревью — учимся у опытных! 👨‍💻

Код-ревью — это процесс проверки кода другим разработчиком. Это обязательная практика в профессиональных командах.

## Зачем нужен код-ревью?

✅ Нахождение ошибок до production
✅ Обмен знаниями в команде
✅ Соблюдение стандартов кода
✅ Обучение junior-разработчиков

## Что проверяют на код-ревью:

```javascript
// ❌ Плохой код:
function f(x) {
    return x*2
}

// ✅ Хороший код:
function doubleValue(number) {
    return number * 2;
}
```

## Правила хорошего кода:

1. **Понятные имена** — `userName`, не `u` или `x`
2. **Точка с запятой** — всегда в конце выражений
3. **Комментарии** — объясняй сложную логику
4. **DRY принцип** — Don't Repeat Yourself

💡 **Совет:** Код читают люди, а не только компьютеры. Пиши так, чтобы было понятно другим!""",
                "task": {
                    "question": "Что означает принцип DRY в программировании?",
                    "options": ["Don't Repeat Yourself", "Do Run Yearly", "Define React Yesterday", "Debug Run Yield"],
                    "correct_answer": "Don't Repeat Yourself",
                    "explanation": "DRY (Don't Repeat Yourself) — принцип программирования, призывающий избегать дублирования кода. Повторяющийся код выносится в функции или компоненты."
                }
            }
        ]

        for level_data in levels_data:
            task_data = level_data.pop("task")
            level = Level(profession_id=prof_fe.id, **level_data)
            db.add(level)
            await db.flush()

            task = Task(level_id=level.id, **task_data)
            db.add(task)

        await db.commit()
        print("✅ Seed data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
