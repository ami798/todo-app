# Todo app (Next.js + Express + TypeScript, JSON file storage)

## Run it
Backend:  cd backend && npm install && npm run dev      (http://localhost:4000)
Frontend: npx create-next-app@latest frontend --ts --app --no-tailwind --eslint --src-dir=false --import-alias "@/*"
          then copy the contents of frontend-src/ over frontend/ (app/ and lib/), and: cd frontend && npm run dev

## API
| Method | URL | Purpose |
|---|---|---|
| GET | /todos?status=all\|active\|completed&q=text | List + filter + search, returns { todos, counts } |
| POST | /todos | Create { title } -> 201 |
| PATCH | /todos/:id | Update { title?, completed? } |
| DELETE | /todos/:id | Delete one -> 204 |
| DELETE | /todos/completed | Clear all completed |

Errors: 400 invalid input, 404 unknown id, 500 unexpected.
