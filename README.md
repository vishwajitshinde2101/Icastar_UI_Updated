
# Services Layer (Artist APIs)

This project now includes a lightweight, mockable services layer under `services/` that you can switch to real backend endpoints later just by changing environment variables. The HTTP client is powered by Axios.

## Files

- `services/apiClient.ts` — Reusable fetch-based HTTP client with JSON handling and token header support.
- `services/apiClient.ts` — Reusable Axios-based HTTP client with JSON handling and token header support.
- `services/types.ts` — Shared DTOs and pagination types for service responses/inputs.
- `services/artistService.ts` — Artist-focused API functions with mock mode.

## Environment Configuration

- `VITE_API_BASE_URL` — Base URL for real API calls, e.g. `https://api.example.com` (defaults to `/api`).
- `VITE_USE_MOCKS` — Toggle mock mode. Set to `false` to call real APIs. Defaults to `true` when not set.

You can define these in a `.env` file at the project root (Vite convention):

```
VITE_API_BASE_URL=https://api.example.com
VITE_USE_MOCKS=false
```

Install dependency:

```
npm i axios
```

## Artist Services

From `services/artistService.ts`:

- `getArtistProfile(token?)`
- `updateArtistProfile(input, token?)`
- `registerArtist(payload, token?)`
- `listJobs(params?, token?)`
- `applyToJob(jobId, payloadOrToken?, token?)` — payload is optional
- `listApplications(params?, token?)`
- `listMessages(params?, token?)`
- `sendMessage(to, body, token?)`

All functions return typed data and support an optional `token` for Authorization headers.

## Usage Examples

Import using the existing alias `@` (configured in `vite.config.ts`):

```ts
import { listJobs, getArtistProfile, registerArtist } from '@/services/artistService'

// Listing jobs
const jobs = await listJobs({ page: 1, pageSize: 10 })

// Getting profile
const profile = await getArtistProfile()

// Register artist (used in pages/artist/ArtistRegistrationForm.tsx)
const saved = await registerArtist({ name: 'Aria', bio: 'Singer' })
```

## Switching to Real Backend Later

1. Set `VITE_USE_MOCKS=false` in your `.env`.
2. Set `VITE_API_BASE_URL` to your backend base URL.
3. Adjust endpoint paths inside `services/artistService.ts` if your routes differ (e.g., `/artist/profile`, `/artist/jobs`, etc.).

No UI changes should be necessary as long as the response shapes align with the DTOs in `services/types.ts`.

## User/Auth Services

New module: `services/userService.ts` with mock mode support.

Available functions:

- `login({ email, password }) => { token, user }`
- `register({ name, email, password, role }) => { token, user }`
- `sendOtp(email) => { success }`
- `verifyOtp(email, otp) => { token, user }`
- `forgotPassword(email) => { success }`
- `resetPassword(token, newPassword) => { success }`
- `getMe(token?) => user`

Example usage (see `pages/Auth.tsx` integration):

```ts
import { login, register } from '@/services/userService'

const { token, user } = await login({ email, password })
localStorage.setItem('token', token)
```

