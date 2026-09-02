# Performance Lab

Персональная образовательная платформа для подготовки Performance Marketing Specialist с фокусом на ChatGPT Ads, PPC (Google Ads, Amazon Ads), Meta Ads и аналитику.

24 модуля, 69+ уроков, калькуляторы метрик, симулятор ChatGPT Ads Manager, Context Hint Lab, Ad Builder, Campaign Architecture Builder, симулятор Google Ads, диагностика кампаний, портфолио-проекты, финальный экзамен и многое другое.

## Как запустить


**1. Скачайте проект.** Откройте Терминал (на Mac: Spotlight → «Terminal») и выполните:

```bash
git clone https://github.com/Petrunkoalina/performance-lab.git
cd performance-lab
```

Если `git` не установлен — можно вместо этого скачать проект архивом: на странице репозитория нажать зелёную кнопку **Code → Download ZIP**, распаковать и в терминале перейти в распакованную папку (`cd путь/к/папке`).

**2. Запустите сервер:**

```bash
python3 serve.py 5173
```

Если система не найдёт `python3`, попробуйте `python serve.py 5173`.

**3. Откройте в браузере:**

**http://localhost:5173**

Чтобы остановить сервер — вернитесь в терминал и нажмите `Ctrl+C`. Чтобы снова открыть платформу позже — просто повторите шаг 2.


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
