# Security Specification: Now Accepting Flowers CMS

## 1. Data Invariants
1. **Case Study**: Represented in the `/caseStudies` collection.
   - Any client write (create, update, delete) MUST only be permitted by verified, authenticated administrators present in the `/admins` collection.
   - Slugs must be unique, non-empty, and limited in size.
   - All text fields (name, description, industry, etc.) are subjected to type checking and strict boundary limits.
2. **Administrators**: Represented in `/admins`.
   - Read-only for self/public depending on authentication.
   - Bootstrapped with verified user `adamosadon@gmail.com`.
3. **No Unauthenticated Writes**: Unauthenticated guests are strictly forbidden from writing or altering any content in `/caseStudies` or `/admins`.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
We assert that each of these malicious operations returns `PERMISSION_DENIED`:

1. **Anonymous Write to Case Studies**: Create `/caseStudies/fake-study` without any Auth credentials.
2. **Standard User Write to Case Studies**: Create `/caseStudies/fake-study` authenticated as a standard non-admin account (e.g., standard guest).
3. **Admin Identity Spoofing**: Signed-in user attempts to create themselves as an admin inside `/admins/{yourUid}` without being bootstrapped.
4. **Incorrect ID Parameter**: Write a document with a malformed ID (e.g., characters like `???/$$`) containing 500 bytes of data.
5. **System-Type Poisoning**: Attempt to update a case study's `order` field with a string/boolean value (Type safety boundary).
6. **Immutable Field Alteration**: A logged-in Admin attempts to change `createdAt` or initial core metadata.
7. **Bypassing Whitelist Fields**: Attempting to inject random properties `ghostField: true` during update.
8. **PII Isolation Leakage**: Attempting to read `/admins` user emails as an unauthenticated guest.
9. **Exceeding Size Limits**: Attempting to write a description of >50,000 characters to a Case Study.
10. **State Shortcutting**: Skipping authentication checks during list queries.
11. **Malicious Query Scraping**: Attempting to retrieve lists of user admins without specific admin verification.
12. **Temporal Falsification**: Sending a client-side timestamp for `updatedAt` instead of `request.time`.

## 3. Test Structure Definition
We verify that these states throw permission denials on the client and enforce our zero-trust models.
