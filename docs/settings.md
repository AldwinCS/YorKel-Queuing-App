# Settings

The dashboard gear opens `/settings` as a dedicated page. The page uses the
same red and cream tokens as login, registration, dashboard, and player profile.

## Identity

Player ID uses the authenticated Supabase user ID when a session exists and
falls back to the sample player ID in preview mode. Device ID is generated once
per browser and stored locally. Both values have copy controls.

## Appearance

Light and Dark force the selected theme. System listens to
`prefers-color-scheme` and updates live when the operating-system preference
changes. The selected option is stored under `yorkel.appearance`, applies to all
routes, and is restored before React renders to reduce theme flashing.

## Backup and restore

The settings row opens `/settings/backup` as a dedicated page. Creating a
recovery code encodes the versioned local profile and match history into a
portable, URL-safe value that can be copied. The same data can also be
downloaded as a JSON backup file.

Restore accepts a pasted recovery code or a JSON file up to 1 MB, validates its
structure, and saves valid profile data locally. Invalid codes and files show
an error without replacing current data.

## Delete all user data

Deletion requires the user to type `DELETE`. It removes YorKel data stored in
the current browser, resets appearance to System, signs the user out, and sends
them to Login. This project does not have a server-side account-deletion Edge
Function or data schema, so the page explicitly states that cloud-account
deletion is not connected instead of claiming remote data was deleted.
