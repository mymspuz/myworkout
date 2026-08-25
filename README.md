# Приложение для учёта выполненных упражнений

Учёт тренировок и статистика: React-фронтенд и Django-бэкенд в одном репозитории.

---

### Основные возможности

- выбирать тип упражнения
- вносить количество и дополнительное утяжеление
- учет веса
- просмотр статистики

---

### Используемый стек

Используем подход Clean Architecture. В качестве css-framework - Materialize

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" width="40" height="40" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" title="TypeScript" width="40" height="40" />

---

### Состав репозитория

| путь | что это |
|---|---|
| `src/`, `public/`, `package.json` | исходники фронтенда (React + TypeScript) |
| `backend/` | Django + DRF: API, модели, миграции, админка |
| `req.txt` | зависимости Python |
| `tmpl/` | ранние html-макеты |

Раньше здесь был только фронтенд; бэкенд добавлен из рабочего развёртывания.

---

### Запуск бэкенда

Нужен **Python 3.10**: Django 4.0 использует модуль `cgi`, удалённый в Python 3.13.

```bash
python3.10 -m venv env
env/bin/pip install -r req.txt
cp .env.example .env          # заполнить DJANGO_SECRET_KEY
set -a && . ./.env && set +a
cd backend && ../env/bin/python manage.py migrate
../env/bin/python manage.py runserver
```

Секреты в коде не хранятся: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` и
`CSRF_TRUSTED_ORIGINS` читаются из переменных окружения, без
`DJANGO_SECRET_KEY` приложение не стартует.

---

### Сборка фронтенда для отдачи бэкендом

Django отдаёт собранный фронтенд как шаблон, поэтому сборка кладётся внутрь `backend/`:

```bash
npm ci && npm run build
cp -r build/* backend/frontend/
cd backend && python manage.py collectstatic --noinput   # соберёт в backend/static/
```

`backend/frontend/` и `backend/static/` — результат сборки, в репозиторий не коммитятся.

---

### Развёртывание

Работает под gunicorn (`backend/gunicorn_config.py`, `127.0.0.1:8000`), перед ним
обратный прокси, который сам раздаёт `/static/` с диска — под gunicorn Django
статику не обслуживает. Управление через systemd, `.env` подключается
директивой `EnvironmentFile`.
