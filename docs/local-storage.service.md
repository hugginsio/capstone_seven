# LocalStorageService

## Application Defaults

The LocalStorageService sets several key values upon app startup, located in `app.component.ts`. These defaults match the default menu options presented in the UI. The default keys and values are:

Key                   | Value
--------------------- | -----
game__mode            | pva
game__ai-difficulty   | easy
game__guided-tutorial | false
game__board-seed      | random

### Storage Context

Note that each key is prefixed by `game__`. This is the storage context, which is managed by the LocalStorageService and set by the user. We use contexts to avoid key collisions, as local storage is global. The current context can be set with the `setContext()` method, and retrieved with the `getContext()` method. It will default to `default`, and must be set for each component that instantiates the service. The current context will automatically be prefixed to the provided key when setting or getting values from the datastore.

For example, to fetch the value of `game__mode`, assuming your context was set to `game`, simply use:

```javascript
fetch('mode');
```

Similarily, to set `game__mode`, assuming your context was set to `game`, simply use:

```javascript
store('mode', 'ez');
```