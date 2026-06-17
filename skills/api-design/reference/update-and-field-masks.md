# Update and field masks

How to design updates that stay compatible as the resource grows. Supports `API-002`. Follows [AIP-134](https://google.aip.dev/134).

## PATCH, not PUT

Standardize updates on **`PATCH`**. `PUT` replaces the whole resource, so when you later add a field the client doesn't know about, a `PUT` from that client silently wipes it. `PATCH` changes only what is named, which is safe as the API evolves.

## `update_mask`

The update request carries a `google.protobuf.FieldMask` named **`update_mask`**:

- It names fields of the **resource** being updated (not of the request message): `update_mask=display_name,labels`.
- It is **optional.** If omitted, the server treats it as an implied mask of **all populated (non-empty) fields** in the supplied resource.
- A mask of **`*`** means full replacement (`PUT` semantics): every field is set to the supplied value and unset fields are cleared. Use with care — `*` will clear any newly-added mutable field that an older client doesn't yet send.
- Only masked fields change; everything else is untouched.
- To **clear** a field, name it in the mask and send it empty.

## Partial update behavior

The response is the updated resource and includes the fields that were sent and in the mask (unless they are input-only). For expensive-to-compute fields, the server may return only what changed.

## Immutable and output-only fields

- **Immutable** fields (set at create, never changed afterward) are rejected or ignored when named in an update.
- **Output-only** fields (server-computed — `name`, `uid`, `create_time`, `update_time`, `state`) are never settable; they are ignored on write.

## `allow_missing` (upsert)

An optional `bool allow_missing` lets an update **create** the resource when it does not exist (upsert). On creation, **all** supplied fields are applied regardless of the field mask.

## Examples

Update just the display name:

```
PATCH /v1/publishers/123/books/les-miserables?update_mask=displayName
{ "displayName": "Les Misérables (Unabridged)" }
```

Clear a field (name it in the mask, send empty):

```
PATCH /v1/publishers/123/books/les-miserables?update_mask=description
{ "description": "" }
```
