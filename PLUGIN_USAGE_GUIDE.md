# Plugin System Usage Guide

## Overview

The plugin system has been converted to TypeScript and provides a structured way to validate incoming request payloads using Joi. The validation is now handled directly in the controllers, giving you full control over error handling and response formatting.

## Plugin Structure

### Plugin Directory Structure

```
src/plugins/
├── index.ts                 # Main plugin loader
└── Users/
    ├── signup.ts           # User signup validation
    ├── login.ts            # User login validation
    └── update.ts           # User update validation
```

### Plugin Interface

Each plugin must implement the `IPlugin` interface:

```typescript
export interface IPlugin {
  schema(): Joi.ObjectSchema;
  decorate(value: any): any;
}
```

## How to Create a New Plugin

### 1. Create the Plugin File

Create a new file in the appropriate directory (e.g., `src/plugins/Users/newPlugin.ts`):

```typescript
import _ from "lodash";
import * as Joi from "joi";

export interface INewPlugin {
  schema(): Joi.ObjectSchema;
  decorate(value: any): any;
}

export const schema = (): Joi.ObjectSchema => {
  return Joi.object().keys({
    // Define your validation rules here
    field1: Joi.string().required(),
    field2: Joi.number().optional(),
  });
};

export const decorate = (value: any): any => {
  return _.chain({
    field1: _.get(value, "field1", undefined),
    field2: _.get(value, "field2", undefined),
    // Add any computed fields
    timestamp: new Date().toISOString(),
  })
    .omitBy(_.isUndefined)
    .omitBy(_.isNull)
    .value();
};

const newPlugin: INewPlugin = {
  schema,
  decorate,
};

export default newPlugin;
```

### 2. The Plugin is Automatically Loaded

The plugin system automatically discovers and loads all plugins in the directory structure.

## How to Use Plugins in Controllers

### 1. Inject PluginsHelper

Make sure your controller receives the `pluginsHelper`:

```typescript
const userController = ({ logger, helpers, userService, pluginsHelper }: {
    logger: Interfaces.AppLogger;
    helpers: Interfaces.Helpers;
    userService: Interfaces.User.IUserService;
    pluginsHelper: IPluginsHelper;
}): Interfaces.User.IUserController => {
```

### 2. Use the Validation Helper

The controller includes a `validateRequest` helper function:

```typescript
const validation = await validateRequest("Users", req.body, { type: "signup" });

if (!validation.isValid) {
  logger.error("Validation error occurred:", validation.error);
  return res.status(400).json(validation.errorResponse);
}

// Use validation.validatedData for your business logic
const user = await userService.createUser(validation.validatedData);
```

## Example Usage

### Current Implementation in UserController

#### Create User (using signup plugin)

```typescript
createUser: async (req: Request, res: Response) => {
  try {
    logger.info("POST /users - Creating new user");

    // Validate request body using the signup plugin
    const validation = await validateRequest("Users", req.body, {
      type: "signup",
    });

    // Return validation errors if any
    if (!validation.isValid) {
      logger.error("Validation error occurred:", validation.error);
      return res.status(400).json(validation.errorResponse);
    }

    // Use the validated and decorated data to create the user
    const user = await userService.createUser(validation.validatedData);

    res.status(201).json({ user });
  } catch (error) {
    // Error handling...
  }
};
```

#### Update User (using update plugin)

```typescript
updateUser: async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`PUT /users/${id} - Updating user`);

    // Validate request body using the update plugin
    const validation = await validateRequest("Users", req.body, {
      type: "update",
    });

    // Return validation errors if any
    if (!validation.isValid) {
      logger.error("Validation error occurred:", validation.error);
      return res.status(400).json(validation.errorResponse);
    }

    // Use the validated and decorated data to update the user
    const user = await userService.updateUser(id, validation.validatedData);

    res.json({ user });
  } catch (error) {
    // Error handling...
  }
};
```

## Available Plugins

### Users/signup.ts

- Validates user registration data
- Includes username, email, password, profile information
- Automatically adds timestamp (dt)

### Users/login.ts

- Validates user login data
- Includes email, password, remember_me flag
- Automatically adds login_timestamp

### Users/update.ts

- Validates user update data
- All fields are optional (at least one required)
- Automatically adds update timestamp (dtu)

## Error Response Format

When validation fails, the system returns a structured error response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "\"password\" length must be at least 8 characters long",
      "value": "123"
    }
  ]
}
```

## Benefits

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Automatic Discovery**: Plugins are automatically loaded from the directory structure
3. **Consistent Validation**: Standardized validation and error handling
4. **Data Decoration**: Automatic data transformation and enrichment
5. **Controller-Level Control**: Validation happens in controllers for better error handling
6. **Extensible**: Easy to add new plugins for different validation scenarios

## Adding New Plugin Categories

To add plugins for other entities (e.g., Products, Orders), simply create new directories:

```
src/plugins/
├── Users/
│   ├── signup.ts
│   └── login.ts
├── Products/
│   ├── create.ts
│   └── update.ts
└── Orders/
    ├── create.ts
    └── update.ts
```

Then use them in controllers:

```typescript
const validation = await validateRequest("Products", req.body, {
  type: "create",
});
```
