# Security Specification — Admin Panel (Contact Messages & Research Articles)

## 1. Data Invariants
1. **PII Isolation**: Contact messages contain sender PII (`fullName`, `email`, `message`). Public visitors and non-admin signed-in users can NEVER `get`, `list`, `update`, or `delete` any document in `/contact_messages/{messageId}`.
2. **Verified Admin Only**: Only the verified owner account (`selmanutkumarmara@gmail.com` with `email_verified == true`) or a pre-seeded `/admins/{uid}` document can read/manage contact messages or create/edit/delete/read-drafts in `/research_articles/{articleId}`.
3. **Strict Create Schema (Contact Messages)**: Public form submissions MUST contain exact keys, enforce length bounds and email regex, force `status == 'unread'`, and set `createdAt == request.time` and `updatedAt == request.time`.
4. **Immutable Message Content**: Once submitted, `fullName`, `email`, `subject`, `message`, `lang`, and `createdAt` can never be mutated. Only `status` and `updatedAt` may be updated by an admin.
5. **Research Draft Isolation**: Public visitors can only `get` or `list` `/research_articles/{articleId}` documents where `resource.data.published == true`. Unpublished drafts are strictly isolated to verified admins.
6. **Research Write Integrity**: Only verified admins can `create`, `update`, or `delete` `/research_articles/{articleId}`. All strings, slug pattern, category enum, `readTimeMinutes` range (1–60), takeaways list bounds (<=8), and server timestamps are strictly validated. `createdAt` is immutable on update.
7. **No Self-Assigned Admin**: Client writes to `/admins/{adminId}` are unconditionally denied (`allow write: if false`).

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated List Scrape (PII)**: Unauthenticated `list` on `/contact_messages`.
2. **Non-Admin Authenticated Read (PII)**: Signed-in non-admin user attempts `get` or `list` on `/contact_messages`.
3. **Email Spoofing Attack**: Signed-in user with `email == 'selmanutkumarmara@gmail.com'` and `email_verified == false` attempts `list` on `/contact_messages` or `create` on `/research_articles`.
4. **Shadow Field Injection (Contact)**: Public `create` on `/contact_messages/msg-1` including extra field `{ isAdmin: true }`.
5. **Status Spoofing on Create (Contact)**: Public `create` with `status: 'archived'` instead of `'unread'`.
6. **Client Timestamp Forgery**: Public or admin `create` with client-supplied `createdAt` differing from `request.time`.
7. **ID Poisoning**: `create` with invalid document ID containing special characters or >128 chars (`doc$$invalid`).
8. **Denial-of-Wallet Oversized Payload**: `create` with 10,000-char `message` or 50,000-char `bodyTr` exceeding `maxLength`.
9. **Unauthorized Research Draft Read**: Public or non-admin user attempts `get` or `list` on `/research_articles` where `published == false`.
10. **Unauthorized Research Mutation**: Non-admin signed-in user attempts `create`, `update`, or `delete` on `/research_articles/{id}`.
11. **Value & Array Poisoning on Research**: Admin attempts `create`/`update` with 20 items in `keyTakeawaysTr` or invalid `categoryKey: 'unknown'` or shadow field `extra: 1`.
12. **Privilege Escalation**: Authenticated user attempts `create` on `/admins/{uid}` to grant themselves admin access.
