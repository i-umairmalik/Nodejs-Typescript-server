# Modular Architecture with Dependency Injection

This project uses Awilix for dependency injection with a modular architecture where controllers, routes, services, and middlewares are automatically registered as modules in the container.

## Structure

### Function-Based Modules

All modules are structured as functions that receive their dependencies as parameters and return their functionality. This follows the pattern:

```typescript
const moduleName = ({
  dependency1,
  dependency2,
}: {
  dependency1: Type1;
  dependency2: Type2;
}) => {
  // Initialize module
  return {
    // Module functionality
  };
};

export default moduleName;
```

### Module Types

#### Controllers

Located in `src/controllers/`

- Handle HTTP request/response logic
- Receive services and other dependencies via DI
- Example: `healthController.ts`, `userController.ts`

#### Routes

Located in `src/routes/`

- Define Express routes and middleware
- Receive controllers and middlewares via DI
- Return Express Router instances
- Example: `healthRoutes.ts`, `userRoutes.ts`

#### Services

Located in `src/services/`

- Contain business logic
- Can depend on other services, adapters, etc.
- Example: `userService.ts`

#### Middlewares

Located in `src/middlewares/`

- Express middleware functions
- Can be injected into routes
- Example: `authMiddleware.ts`, `errorMiddleware.ts`

## How It Works

### 1. Module Registration

In `src/di/init.ts`, the container automatically loads modules using:

```typescript
container.loadModules(
  [
    "../controllers/**/*.ts",
    "../routes/**/*.ts",
    "../services/**/*.ts",
    "../middlewares/**/*.ts",
  ],
  {
    cwd: __dirname,
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asFunction,
    },
  }
);
```

### 2. Module Resolution

Modules are resolved in `src/routes/index.ts` using:

```typescript
const healthRoute = container.resolve("healthRoutes");
const userRoute = container.resolve("userRoutes");
```

### 3. Dependency Injection

Dependencies are automatically injected based on parameter names:

```typescript
// This controller will receive logger and userService automatically
const userController = ({
  logger,
  userService,
}: {
  logger: IAppLogger;
  userService: any;
}) => {
  // Implementation
};
```

## Adding New Modules

### New Controller

1. Create file in `src/controllers/`
2. Structure as function with dependencies
3. Export as default
4. It will be automatically registered as `{filename}Controller`

### New Route

1. Create file in `src/routes/`
2. Structure as function that returns Express Router
3. Export as default
4. Add route registration in `src/routes/index.ts`

### New Service

1. Create file in `src/services/`
2. Structure as function with dependencies
3. Export as default
4. It will be automatically available for injection

### New Middleware

1. Create file in `src/middlewares/`
2. Structure as function returning middleware functions
3. Export as default
4. Inject into routes or register globally

## Benefits

- **Automatic Registration**: No manual registration required
- **Type Safety**: TypeScript support with proper typing
- **Testability**: Easy to mock dependencies for testing
- **Modularity**: Clear separation of concerns
- **Scalability**: Easy to add new modules without configuration changes

## Example Usage

```typescript
// Service
const userService = ({
  logger,
  mongoDB,
}: {
  logger: IAppLogger;
  mongoDB: any;
}) => ({
  async findUser(id: string) {
    logger.info(`Finding user ${id}`);
    return await mongoDB.collection("users").findOne({ _id: id });
  },
});

// Controller
const userController = ({
  logger,
  userService,
}: {
  logger: IAppLogger;
  userService: any;
}) => ({
  async getUser(req: Request, res: Response) {
    const user = await userService.findUser(req.params.id);
    res.json(user);
  },
});

// Route
const userRoutes = ({ userController }: { userController: any }) => {
  const router = express.Router();
  router.get("/:id", userController.getUser);
  return router;
};
```

The container automatically wires these together based on their dependencies!
