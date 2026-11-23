# Security Specification — Contact Messages Inbox

## 1. Data Invariants
1. **PII Isolation**: Contact messages contain sender PII (`fullName`, `email`, `message`). Public visitors and non-admin signed-in users can NEVER `get`, `list`, `update`, or `delete` any document in `/contact_messages/{messageId}`.
2. **Verified Admin Only**: Only the verified owner account (`selmanutkumarmara@gmail.com` with `email_verified == true`) or a pre-seeded `/admins/{uid}` document can read, update status, or delete contact messages.
3. **Strict Create Schema**: Public form submissions MUST contain exact keys (`fullName`, `email`, `subject`, `message`, `lang`, `status`, `createdAt`, `updatedAt`), enforce length bounds and email regex, force `status == 'unread'`, and set `createdAt == request.time` and `updatedAt == request.time`.
4. **Immutable Message Content**: Once submitted, `fullName`, `email`, `subject`, `message`, `lang`, and `createdAt` can never be mutated. Only `status` and `updatedAt` may be updated by an admin.
5. **No Self-Assigned Admin**: Client writes to `/admins/{adminId}` are unconditionally denied (`allow write: if false`).

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated List Scrape**: Unauthenticated `list` on `/contact_messages`.
2. **Non-Admin Authenticated Read**: Signed-in non-admin user attempts `get` or `list` on `/contact_messages`.
3. **Email Spoofing Attack**: Signed-in user with `email == 'selmanutkumarmara@gmail.com'` and `email_verified == false` attempts `list` or `get`.
4. **Shadow Field Injection**: Public `create` on `/contact_messages/msg-1` including extra field `{ isAdmin: true }`.
5. **Status Spoofing on Create**: Public `create` with `status: 'archived'` instead of `'unread'`.
6. **Client Timestamp Forgery**: Public `create` with client-supplied `createdAt` differing from `request.time`.
7. **ID Poisoning**: Public `create` with invalid document ID containing special characters or >128 chars (`msg$$invalid`).
8. **Denial-of-Wallet Oversized Payload**: Public `create` with 10,000-character `message` exceeding `maxLength: 4000`.
9. **Invalid Email Format**: Public `create` with `email: 'not-an-email'`.
10. **Unauthorized Message Mutation**: Admin attempts `update` altering `message` or `email` (violating `affectedKeys().hasOnly(['status', 'updatedAt'])`).
11. **Value Poisoning on Update**: Admin attempts `update` setting `status: 12345` or `status: 'hacked'`.
12. **Privilege Escalation**: Authenticated user attempts `create` on `/admins/{uid}` to grant themselves admin access.
