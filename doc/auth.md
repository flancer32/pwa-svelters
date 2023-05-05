# Public Key authentication

## Sign Up

### Регистрация пользователя

Пользователь заполняет на фронте регистрационную форму и отправляет данные на
бэк (модель `Svelters_Front_Mod_User_Sign_Up.register`, сервис `Svelters_Shared_Web_Api_User_Sign_Up_Register`). Если
браузер пользователя поддерживает WebAuthn API, то это указывается в запросе (`useWebAuthn`). При регистрации
пользователю назначается UUID, уникальный в пределах приложения.

### Получение запроса на генерацию ключа

Сервис на бэке регистрирует нового пользователя и при необходимости генерирует attest
challenge (action `Fl32_Auth_Back_Act_Attest_Challenge`).

### User attestation

Фронт формирует данные для аттестации пользователя (`Fl32_Auth_Front_Mod_WebAuthn.composeOptPkCreate`) и отправляет
данные через модель `Fl32_Auth_Front_Mod_WebAuthn.attest` на сервис `Fl32_Auth_Shared_Web_Api_Attest`. Бэкенд
сохраняет публичный ключ и идентификатор аттестата, привязывая его к ID пользователя. После чего возвращает на фронт
идентификатор аттестата и bid для сохранённого публичного ключа.

### Сохранение данных об аттестации

Идентификатор аттестата сохраняется в браузере через модель `Fl32_Auth_Front_Mod_Store_Attestation`.

## Sign In

### Проверка возможности аутентификации

Возможность аутентификации проверяется через модель `Fl32_Auth_Front_Mod_Store_Attestation`. Хранилище браузера
должно содержать данные об используемом аттестате.

### Получение assertion challenge

Если аутентификация возможна, то фронт запрашивает assertion challenge через
модель `Fl32_Auth_Front_Mod_WebAuthn.signInChallenge` и сервис `Fl32_Auth_Shared_Web_Api_Assert_Challenge`.

### Аутентификация

Фронт формирует данные для аутентификации при помощи модели `Fl32_Auth_Front_Mod_WebAuthn.composeOptPkGet`, а затем
подписывает подтверждение аутентификации (assertion). Подтверждение через
модель `Svelters_Front_Mod_User_Sign_In.validate` отправляется на
сервис `Svelters_Shared_Web_Api_User_Sign_In_Validate`.

### Проверка подтверждения аутентификации

Сервис `Svelters_Shared_Web_Api_User_Sign_In_Validate` использует action `Fl32_Auth_Back_Act_Assert_Validate` для
проверки аутентификации. Если аутентификация подтверждается, то сервис инициирует пользовательскую сессию для
подтверждённого аттестата. Данные аттестата, содержащие `userBid`, возвращаются action'ом. 