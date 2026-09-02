# Performance Lab

Персональная образовательная платформа для подготовки Performance Marketing Specialist с фокусом на ChatGPT Ads, PPC (Google Ads, Amazon Ads), Meta Ads и аналитику.

24 модуля, 69+ уроков, калькуляторы метрик, симулятор ChatGPT Ads Manager, Context Hint Lab, Ad Builder, Campaign Architecture Builder, симулятор Google Ads, диагностика кампаний, портфолио-проекты, финальный экзамен и многое другое.

## Технологии

Никакого фреймворка и шага сборки — чистые HTML/CSS/JavaScript (ES-модули), запускается через простой Python-сервер. Весь прогресс пользователя сохраняется локально в `localStorage` браузера.

## Как запустить у себя

Понадобится только Python 3 (обычно уже установлен на macOS/Linux; на Windows — скачать с [python.org](https://www.python.org/downloads/)).

```bash
git clone <URL_ЭТОГО_РЕПОЗИТОРИЯ>
cd performance-lab
python3 serve.py 5173
```

Затем откройте в браузере: **http://localhost:5173**

Чтобы остановить сервер — нажмите `Ctrl+C` в терминале.

## Структура проекта

```
performance-lab/
  index.html          — точка входа
  serve.py            — локальный сервер (без кеширования, для разработки)
  styles/main.css      — дизайн-система
  src/
    app.js             — роутер и точка входа приложения
    components/        — все страницы и виджеты (Dashboard, Lesson, ChatGPT Ads Lab и т.д.)
    data/modules/       — контент всех 24 модулей курса
    utils/              — хранилище (localStorage), калькуляторы, эвристики оценки
```

## Примечания

- Симуляторы (ChatGPT Ads Lab, PPC Lab и др.) используют полностью искусственные данные и не отражают реальную эффективность рекламы.
- Факты о ChatGPT Ads сверены с официальной документацией OpenAI (help.openai.com, openai.com/policies/ad-policies) и помечены статусами Confirmed / Beta / Limited / Strategic Hypothesis.
