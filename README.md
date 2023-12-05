# Whatsapp Service

Whatsapp service to send message via API

## Installation

- Install project dependencies

```shell
yarn
```

- Adjust env variables as needed

## Serve

- Serve for development

```shell
yarn dev
```

- Build for production

```shell
yarn build
```

## Features

Features are secured with basic auth, we need to pass header `Authorization: Basic <credentials>` on every request.
Where credentials made of base64 encode `username:password`. The username and password are customizable via env variables.

In order to send a message, we need to create session from phone number in advance to initialize the whatsapp socket.
Several endpoints required session to act as a sender, we need to attach the session to the request header for instance: `session: +621234567890`.

Public endpoints:

- All endpoints on sessions module.

Protected endpoints:

- All endpoints on persons module.
- All endpoints on groups module.

### Sessions Module

- Create Session

Create sender session, returns QR code data URL.
Replace the id with actual sender's phone number according to the [whatsapp phone number format](https://faq.whatsapp.com/1294841057948784/?helpref=uf_share).

`[POST] /sessions`

Request body

```json
{
  "id": "+621234567890"
}
```

Response body

```json
{
  "data": {
    "qrCodeDataUrl": "data:image/png;base64,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"
  },
  "message": "Please scan the given QR code to continue!"
}
```

- Find Session

Find existing sender session, returns message when exists.

`[GET] /sessions/+621234567890`

Response body

```json
{
  "message": "Session +621234567890 is found"
}
```

- Delete Session

Delete existing sender session, returns empty.

`[DELETE] /sessions/+621234567890`

### Persons Module

- Get Persons

Get persons in sender whatsapp contact, returns persons data.

`[GET] /persons`

Response body

```json
[
  {
    "id": "+622345678901@whatsapp.net",
    "conversationTimestamp": 1668715224,
    "unreadCount": 1
  },
  {
    "id": "+623456789012@whatsapp.net",
    "conversationTimestamp": 1668715224,
    "unreadCount": 1
  }
]
```

- Send Message

Send a message from sender to person, returns message.

`[POST] /persons/send-message`

Request body

```json
{
  "whatsappId": "+622345678901",
  "text": "Hello world"
}
```

Response body

```json
{
  "message": "Successfully send message"
}
```

- Send Messages

Send bulk messages from sender to persons, returns message.

`[POST] /persons/send-messages`

Request body

```json
{
  "messages": [
    {
      "whatsappId": "+622345678901",
      "text": "Hello world"
    },
    {
      "whatsappId": "+623456789012",
      "text": "Lorem ipsum dolor sit amet"
    }
  ]
}
```

Response body

```json
{
  "message": "Successfully send messages"
}
```

### Groups Module

- Get Groups

Get groups in sender whatsapp contact, returns groups data.

`[GET] /groups`

Response body

```json
[
  {
    "id": "123456789012345678@g.us",
    "conversationTimestamp": 1668715224,
    "name": "Example Group 1",
    "unreadCount": 1
  },
  {
    "id": "234567890123456789@g.us",
    "conversationTimestamp": 1668715224,
    "name": "Example Group 2",
    "unreadCount": 1
  }
]
```

- Send Message

Send a message from sender to group, returns message.

`[POST] /groups/send-message`

Request body

```json
{
  "whatsappId": "123456789012345678@g.us",
  "text": "Hello world"
}
```

Response body

```json
{
  "message": "Successfully send message"
}
```

- Send Messages

Send bulk messages from sender to groups, returns message.

`[POST] /groups/send-messages`

Request body

```json
{
  "messages": [
    {
      "whatsappId": "123456789012345678@g.us",
      "text": "Hello world"
    },
    {
      "whatsappId": "234567890123456789@g.us",
      "text": "Lorem ipsum dolor sit amet"
    }
  ]
}
```

Response body

```json
{
  "message": "Successfully send messages"
}
```
