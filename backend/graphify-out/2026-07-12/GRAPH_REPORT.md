# Graph Report - E:\TransitOps\TransitOps\backend  (2026-07-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 766 nodes · 1870 edges · 24 communities (19 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0bd2429`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VehicleRepository
- User
- VehicleResponse
- .success
- ExpenseResponse
- MaintenanceResponse
- ResourceNotFoundException
- DriverResponse
- ReportController
- SecurityConfig.java
- LoginResponse
- ApiResponse
- DashboardResponse
- mvnw
- ValidationUtil
- CorsConfig.java
- PasswordEncoderConfig.java
- OpenApiConfig.java
- TransitOpsApplication
- AppConfig.java
- com.example.transitops:transit
- SpringBootTest
- Test

## God Nodes (most connected - your core abstractions)
1. `ApiResponse` - 64 edges
2. `TripResponse` - 32 edges
3. `ResourceNotFoundException` - 29 edges
4. `VehicleRepository` - 29 edges
5. `MaintenanceResponse` - 26 edges
6. `VehicleResponse` - 24 edges
7. `DriverResponse` - 23 edges
8. `ExpenseResponse` - 23 edges
9. `TripRepository` - 23 edges
10. `Vehicle` - 23 edges

## Surprising Connections (you probably didn't know these)
- `AuthServiceImpl` --implements--> `AuthService`  [EXTRACTED]
  src/main/java/com/example/transitops/auth/service/AuthServiceImpl.java → src/main/java/com/example/transitops/auth/service/AuthService.java
- `DriverResponse` --references--> `DriverStatus`  [EXTRACTED]
  src/main/java/com/example/transitops/driver/dto/DriverResponse.java → src/main/java/com/example/transitops/common/enums/DriverStatus.java
- `TripResponse` --references--> `TripStatus`  [EXTRACTED]
  src/main/java/com/example/transitops/trip/dto/TripResponse.java → src/main/java/com/example/transitops/common/enums/TripStatus.java
- `SecurityConfig` --references--> `CustomUserDetailsService`  [EXTRACTED]
  src/main/java/com/example/transitops/config/SecurityConfig.java → src/main/java/com/example/transitops/security/CustomUserDetailsService.java
- `SecurityConfig` --references--> `JwtAuthenticationFilter`  [EXTRACTED]
  src/main/java/com/example/transitops/config/SecurityConfig.java → src/main/java/com/example/transitops/security/JwtAuthenticationFilter.java

## Import Cycles
- None detected.

## Communities (24 total, 5 thin omitted)

### Community 0 - "VehicleRepository"
Cohesion: 0.05
Nodes (44): JpaRepository, DriverStatus, AVAILABLE, INACTIVE, ON_DUTY, ON_LEAVE, TripStatus, CANCELLED (+36 more)

### Community 1 - "User"
Cohesion: 0.05
Nodes (44): ApplicationArguments, ApplicationRunner, Claims, FilterChain, GrantedAuthority, OncePerRequestFilter, SecretKey, Entity (+36 more)

### Community 2 - "VehicleResponse"
Cohesion: 0.06
Nodes (41): VehicleStatus, AVAILABLE, IN_USE, RETIRED, UNDER_MAINTENANCE, VehicleType, BUS, PICKUP (+33 more)

### Community 3 - ".success"
Cohesion: 0.08
Nodes (33): BusinessException, DeleteMapping, GetMapping, Operation, PostMapping, PutMapping, RequestMapping, ResponseEntity (+25 more)

### Community 4 - "ExpenseResponse"
Cohesion: 0.06
Nodes (40): ExpenseType, FUEL, INSURANCE, MAINTENANCE, OTHER, TOLL, ExpenseController, DeleteMapping (+32 more)

### Community 5 - "MaintenanceResponse"
Cohesion: 0.07
Nodes (36): MaintenanceStatus, ACTIVE, COMPLETED, DeleteMapping, GetMapping, Operation, PostMapping, PutMapping (+28 more)

### Community 6 - "ResourceNotFoundException"
Cohesion: 0.09
Nodes (27): ResourceNotFoundException, FuelLogController, DeleteMapping, GetMapping, Operation, PostMapping, PutMapping, RequestMapping (+19 more)

### Community 7 - "DriverResponse"
Cohesion: 0.09
Nodes (25): DriverController, DeleteMapping, GetMapping, Operation, PostMapping, PutMapping, RequestMapping, ResponseEntity (+17 more)

### Community 8 - "ReportController"
Cohesion: 0.08
Nodes (33): GetMapping, Operation, RequestMapping, ResponseEntity, RestController, Tag, ReportController, CsvExportResponse (+25 more)

### Community 9 - "SecurityConfig.java"
Cohesion: 0.09
Nodes (32): AccessDeniedException, AccessDeniedHandler, AuthenticationConfiguration, AuthenticationEntryPoint, AuthenticationException, AuthenticationProvider, EnableMethodSecurity, EnableWebSecurity (+24 more)

### Community 10 - "LoginResponse"
Cohesion: 0.13
Nodes (19): AuthController, Operation, PostMapping, RequestMapping, ResponseEntity, RestController, Tag, Getter (+11 more)

### Community 11 - "ApiResponse"
Cohesion: 0.16
Nodes (14): ExceptionHandler, MethodArgumentNotValidException, RestControllerAdvice, Slf4j, DuplicateResourceException, GlobalExceptionHandler, ResponseEntity, UnauthorizedException (+6 more)

### Community 12 - "DashboardResponse"
Cohesion: 0.20
Nodes (13): DashboardController, GetMapping, Operation, RequestMapping, ResponseEntity, RestController, Tag, DashboardResponse (+5 more)

### Community 13 - "mvnw"
Cohesion: 0.33
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 14 - "ValidationUtil"
Cohesion: 0.36
Nodes (4): ConstraintViolation, ValidationUtil, Validator, ValidatorFactory

### Community 15 - "CorsConfig.java"
Cohesion: 0.53
Nodes (4): CorsConfigurationSource, CorsConfig, Bean, Configuration

### Community 16 - "PasswordEncoderConfig.java"
Cohesion: 0.53
Nodes (4): Bean, Configuration, PasswordEncoder, PasswordEncoderConfig

### Community 17 - "OpenApiConfig.java"
Cohesion: 0.70
Nodes (4): OpenAPIDefinition, SecurityScheme, Configuration, OpenApiConfig

## Knowledge Gaps
- **25 isolated node(s):** `com.example.transitops:transit`, `AVAILABLE`, `ON_DUTY`, `ON_LEAVE`, `INACTIVE` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiResponse` connect `ApiResponse` to `VehicleResponse`, `.success`, `ExpenseResponse`, `MaintenanceResponse`, `ResourceNotFoundException`, `DriverResponse`, `ReportController`, `LoginResponse`, `DashboardResponse`?**
  _High betweenness centrality (0.289) - this node is a cross-community bridge._
- **Why does `UserRepository` connect `User` to `VehicleRepository`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `VehicleRepository` connect `VehicleRepository` to `VehicleResponse`, `.success`, `ExpenseResponse`, `MaintenanceResponse`, `ResourceNotFoundException`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `com.example.transitops:transit`, `AVAILABLE`, `ON_DUTY` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VehicleRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.0502497796062298 - nodes in this community are weakly interconnected._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.050616050616050616 - nodes in this community are weakly interconnected._
- **Should `VehicleResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.05974124809741248 - nodes in this community are weakly interconnected._