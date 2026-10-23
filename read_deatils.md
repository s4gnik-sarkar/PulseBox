# ✨ PulseBox — Anonymous Event Feedback Platform

> **Share your vibe. Speak your mind. Stay anonymous.**

PulseBox is a fun, anonymous feedback and community discussion platform for college hackathons, technical fests, workshops, seminars, and other events.

Participants can choose fun avatars, receive unique nicknames, share feedback, react to event experiences, and reply to other attendees. Organizers can create events, share feedback links, and monitor audience sentiment through a dashboard.

The goal is to build a polished, functional full-stack application that can be used at real college events and showcased in a developer portfolio.

---

## 🎯 1. Project Objectives

- Make anonymous feedback fun and engaging.
- Allow participants to retain their anonymous identity across devices.
- Enable public discussions through feedback posts and replies.
- Allow verified organizers to create and manage events.
- Provide organizers with useful feedback analytics.
- Build a secure, responsive application with a clean user experience.

## 🛠️ 2. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js App Router | Frontend and server-side application |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable UI components |
| Supabase Auth | Organizer authentication |
| Supabase PostgreSQL | Database |
| Supabase Storage | Private organizer verification documents |
| QR code library | Generate event feedback QR codes |
| Vercel | Deployment |

**Architecture:** Next.js + Supabase, with database access protected by Row Level Security (RLS).

Keep the initial implementation simple. Avoid adding unnecessary libraries or services.

---

## 👥 3. User Roles

### A. Participants

- Browse an event's public feedback wall.
- Create or recover an anonymous persona.
- Select an avatar and nickname.
- Submit feedback with mood ratings.
- Read and reply to public feedback.
- React to messages.
- Retain their identity across devices using a PulsePass.

### B. Organizers

- Register and log in.
- Submit institutional ID or other accepted proof.
- Wait for administrator approval.
- Create and manage events after approval.
- Generate feedback links and QR codes.
- View feedback, ratings, and event analytics.

### C. Platform Administrator

- Review organizer verification requests.
- Approve or reject applications.
- Access verification documents only when authorized.
- Suspend abusive events or accounts when necessary.

For the MVP, organizer verification can be handled manually. Do not build a complex admin system beyond what is required to approve applications.

---

## 🎭 4. Anonymous Identity — PulsePass

Participants should not need to register with an email address or provide their real name.

### First-time experience

1. Generate a random, unique anonymous identity.
2. Assign a predefined avatar.
3. Generate an attractive nickname, such as `Pixel Panda`, `Cosmic Chai`, or `Neon Ninja`.
4. Generate a high-entropy PulsePass.
5. Show the user a screen to copy or save their PulsePass.

### Returning experience

- On the same browser, restore the persona using a secure persistent session.
- On another device, let the participant enter their PulsePass to recover their persona.
- Restore their avatar, nickname, and existing public posts.

### Identity requirements

- Use a cryptographically secure random generator.
- Ensure PulsePass values are unique.
- Treat the PulsePass as a secret credential, not merely a public username.
- Verify it server-side and rate-limit recovery attempts.
- Never expose the credential in URLs, logs, or public feedback records.
- Store only a secure hash of the recovery credential where applicable.
- Provide clear recovery limitations if the user loses their PulsePass.

For the MVP, PulsePass-only recovery is acceptable if implemented as a long, unpredictable secret with appropriate protections. A short, guessable code is not sufficient.

---

## 💬 5. Core Features

### Feature 1 — Landing Page

- Modern, responsive design.
- PulseBox branding and clear product explanation.
- CTA for organizers to create an event.
- CTA for participants to explore an event.
- Dark and light modes.

### Feature 2 — Anonymous Persona Creation

- Predefined avatar library.
- Automatically generated nickname.
- Option to choose a different avatar or nickname.
- PulsePass generation.
- Copy and save identity options.
- Persistent identity on the same browser.

### Feature 3 — Event Creation

- Organizer signup and login.
- Organizer verification form.
- Private document upload.
- Manual approval workflow.
- Event title, description, date, and feedback deadline.
- Unique public event slug.
- Ability to open or close feedback submissions.

Only approved organizers may create events.

### Feature 4 — Anonymous Feedback

Participants can submit:

- Feedback text.
- Mood reaction or emoji rating.
- Optional 1–5 star rating.
- Category: Experience, Suggestion, or Issue.
- Fun prompts, such as:
  - "What was the biggest W of this event?"
  - "What should we fix before next time?"
  - "What would make the next event legendary?"

Feedback should be published to the public wall after basic server-side validation.

### Feature 5 — Public Feedback Wall

- Display all published feedback for an event.
- Show avatar, nickname, mood, message, and timestamp.
- Allow users to reply to feedback.
- Show reply counts and threaded discussions.
- Allow emoji reactions.
- Support chronological sorting.
- Keep real names and contact details out of public records.

Public visibility should be clearly explained before submission.

### Feature 6 — Organizer Dashboard

Display:

- Total feedback submissions.
- Average star rating.
- Mood distribution.
- Recent feedback.
- Popular suggestions.
- Event status and registration or response trends where applicable.

Use simple charts and cards. Avoid building an advanced analytics engine.

### Feature 7 — QR Code Sharing

- Generate a QR code for each event's public feedback URL.
- Allow organizers to copy the URL.
- Make the feedback page mobile-friendly for quick scanning at event venues.

### Feature 8 — Basic Safety and Validation

Include from the beginning:

- Message length limits.
- Server-side validation.
- Safe text rendering.
- Rate limiting for submissions and recovery.
- Database access controls.
- Report or flag functionality for inappropriate posts.
- Secure organizer permissions.

**Later enhancement:** automatic offensive-language detection, spam classification, AI-generated sentiment summaries, and advanced moderation.

---

## 🗄️ 6. Initial Database Design

Start with the following tables.

### `events`

| Column | Purpose |
|---|---|
| `id` | Unique event ID |
| `organizer_id` | Owner's authenticated user ID |
| `title` | Event name |
| `description` | Event description |
| `slug` | Public event identifier |
| `is_open` | Whether feedback is accepted |
| `event_date` | Event date |
| `feedback_deadline` | Submission deadline |
| `created_at` | Creation timestamp |

### `personas`

| Column | Purpose |
|---|---|
| `id` | Unique persona ID |
| `nickname` | Public anonymous name |
| `avatar_id` | Reference to the avatar library |
| `created_at` | Persona creation timestamp |

### `persona_credentials`

| Column | Purpose |
|---|---|
| `persona_id` | Associated persona |
| `credential_hash` | Securely stored recovery credential hash |
| `created_at` | Credential creation timestamp |

Never store raw PulsePass credentials in this table.

### `feedback`

| Column | Purpose |
|---|---|
| `id` | Unique feedback ID |
| `event_id` | Associated event |
| `persona_id` | Author's anonymous persona |
| `message` | Feedback content |
| `category` | Experience, Suggestion, or Issue |
| `mood` | Selected mood |
| `rating` | Optional 1–5 rating |
| `created_at` | Submission timestamp |

### `replies`

| Column | Purpose |
|---|---|
| `id` | Unique reply ID |
| `feedback_id` | Parent feedback ID |
| `persona_id` | Reply author's persona |
| `message` | Reply text |
| `created_at` | Reply timestamp |

### `organizer_verifications`

| Column | Purpose |
|---|---|
| `id` | Verification request ID |
| `user_id` | Applicant's authenticated ID |
| `organization_name` | College or organization |
| `document_path` | Private storage path |
| `status` | Pending, Approved, or Rejected |
| `reviewed_at` | Review timestamp |

Use private storage and restrict access to verification documents. Add a documented retention and deletion policy.

Additional tables for reactions, reports, and administrator roles can be introduced when their features are implemented.

---

## 🗺️ 7. Development Roadmap — One Feature at a Time

### Phase 1 — Project Setup

- [ ] Create the Next.js project.
- [ ] Configure TypeScript and Tailwind CSS.
- [ ] Set up the base layout and global styles.
- [ ] Create a Git repository.
- [ ] Verify the development server works.

**Acceptance criteria:** The application runs locally without errors.

### Phase 2 — UI Foundation

- [ ] Create the landing page.
- [ ] Establish the PulseBox color palette and typography.
- [ ] Add reusable buttons, cards, inputs, and dialogs.
- [ ] Implement responsive layouts.
- [ ] Add dark and light themes.

**Acceptance criteria:** The landing page looks polished on desktop and mobile.

### Phase 3 — Supabase Setup

- [ ] Create a Supabase project.
- [ ] Configure environment variables.
- [ ] Connect the application to Supabase.
- [ ] Create the initial database tables.
- [ ] Configure RLS policies.
- [ ] Test database connectivity.

**Acceptance criteria:** Data can be read and written through authorized application operations.

### Phase 4 — Anonymous Personas

- [ ] Build the predefined avatar library.
- [ ] Implement nickname generation.
- [ ] Generate unique PulsePass credentials.
- [ ] Add persona creation and persistence.
- [ ] Add copy/save PulsePass functionality.
- [ ] Implement secure identity recovery.

**Acceptance criteria:** A participant can recover the same persona on another device.

### Phase 5 — Public Feedback Wall

- [ ] Build the event feedback page.
- [ ] Add mood and star ratings.
- [ ] Implement feedback submission.
- [ ] Display published messages.
- [ ] Add threaded replies.
- [ ] Add basic emoji reactions.
- [ ] Add validation and rate limits.

**Acceptance criteria:** Participants can submit, view, and reply to messages anonymously.

### Phase 6 — Organizer Authentication

- [ ] Implement organizer signup and login.
- [ ] Add email verification.
- [ ] Create the verification application form.
- [ ] Implement private document uploads.
- [ ] Add manual approval and rejection.
- [ ] Restrict event creation to approved organizers.

**Acceptance criteria:** Unverified organizers cannot create events.

### Phase 7 — Event Management

- [ ] Create the event creation form.
- [ ] Implement unique event slugs.
- [ ] Add event detail pages.
- [ ] Add open/closed feedback status.
- [ ] Add QR code generation.
- [ ] Add organizer event management.

**Acceptance criteria:** An approved organizer can publish an event and share its feedback page.

### Phase 8 — Dashboard and Final Testing

- [ ] Display feedback counts and average ratings.
- [ ] Add mood distribution.
- [ ] Display recent submissions and popular suggestions.
- [ ] Test anonymous persona recovery.
- [ ] Test authorization and RLS policies.
- [ ] Test mobile layouts.
- [ ] Deploy to Vercel.
- [ ] Update the README with screenshots and the live demo URL.

**Acceptance criteria:** The deployed MVP works end to end with real database persistence.

---

## ⏱️ 8. Same-Day MVP Strategy

The complete product above is larger than a one-day MVP. To target an end-of-day demo, implement a narrower vertical slice first.

### Must finish today

1. Project setup and polished landing page.
2. Anonymous avatar and nickname generation.
3. Basic PulsePass creation and recovery.
4. One public event feedback page.
5. Mood-based feedback submissions.
6. Public feedback wall and replies.
7. Basic Supabase persistence.
8. Deployment and end-to-end testing.

### Implement next

- Organizer authentication and verification.
- Event creation and management.
- Organizer analytics.
- QR code sharing.
- Advanced moderation and reactions.

If time permits, add organizer verification and event creation after the participant experience works.

---

## 🔐 9. Security Principles

- Never expose Supabase service-role credentials to the browser.
- Use RLS policies for database access control.
- Verify ownership and permissions server-side.
- Keep organizer documents in private storage.
- Do not expose recovery credentials in logs or public APIs.
- Rate-limit anonymous submissions and recovery attempts.
- Use safe rendering and validate all user input.
- Treat public messages and replies as untrusted user-generated content.
- Provide reporting and moderation controls before opening the platform to a large audience.

Anonymity means hiding participants' real identities from other users. It does not guarantee that every piece of technical metadata is uncollected.

---

## 🚀 10. Deployment and Portfolio Checklist

- [ ] Deploy the application to Vercel.
- [ ] Configure production environment variables.
- [ ] Configure Supabase production access policies.
- [ ] Add sample events and demo feedback.
- [ ] Capture screenshots of the landing page, feedback wall, and dashboard.
- [ ] Document the architecture and database schema.
- [ ] Add setup instructions for local development.
- [ ] Include a live demo and GitHub repository link.
- [ ] Document known limitations and future improvements.

## 📌 Definition of Done

PulseBox MVP is ready when:

- A participant can create an anonymous persona.
- The participant can recover that persona using their PulsePass.
- They can submit mood-based feedback.
- Everyone can view published messages and reply to them.
- Feedback and replies persist in the database.
- The interface works on desktop and mobile.
- Basic security and validation are in place.
- The application is deployed and documented.

**Build small, verify every phase, and avoid implementing future features before the current feature works.**
