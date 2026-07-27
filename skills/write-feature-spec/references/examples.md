# Write Feature Spec — Example

Read this example only when a filled use-case spec is useful.

## Password reset

```md
# Reset password

## Problem

Users who forget their password must contact support to recover access.

## Objective

Allow users to securely regain access without support assistance.

## Scope

- Request a reset link by email.
- Define a new password from a valid link.
- Show success, validation, and failure states.

## Out of scope

- Recovery by SMS.
- Recovery without access to the registered email.
- Changes to multi-factor authentication.

## User flow

1. The user requests a reset link from the login screen.
2. The product always shows the same confirmation, whether the email is
   registered or not.
3. The user opens a valid link and defines a new password.
4. The product confirms success and allows login with the new password.

## Business rules

- A reset link expires after the configured period.
- A reset link can be used only once.
- The request must not reveal whether an email is registered.
- The new password must satisfy the password policy.

## Acceptance criteria

- [ ] A user can request a reset link with a valid email format.
- [ ] The confirmation does not reveal whether the account exists.
- [ ] A valid, unused link allows the user to define a compliant password.
- [ ] Expired or used links are rejected and offer a new request.
- [ ] A successful reset allows login with the new password.

## Edge cases and error states

- Invalid email format.
- Expired or already-used link.
- Weak password.
- Network or email delivery failure.
- Repeated submission.

## Open questions

- How long should the link remain valid?
- Should a successful password change trigger a security notification?
```
