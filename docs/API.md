# ChatX API

Base: `/api/v1`

## Auth
- POST `/auth/request-otp`
- POST `/auth/verify-otp`
- POST `/auth/refresh`
- POST `/auth/logout`

## Users
- GET `/users/me`
- PATCH `/users/me`
- GET `/users/me/privacy`
- PATCH `/users/me/privacy`

## Chats
- GET `/chats`
- POST `/chats`
- GET `/chats/:chatId/messages`
- POST `/chats/:chatId/messages`

## Planned endpoints
Devices, contacts, groups, reactions, media upload URLs, calls, statuses, communities, reports and admin APIs are represented in the architecture and should be implemented behind the same authentication/authorization layer.

## WebSocket
`/ws`

Events:
`message.send`, `message.new`, `message.read`, `typing.start`, `typing.stop`, `presence.updated`, `call.offer`, `call.answer`, `call.ice`, `sync.request`.
