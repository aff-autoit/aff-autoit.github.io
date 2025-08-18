---
title: Vandtætte skotter
by: Andreas Fuller 
---

### Galt Eller
## Genialt

# Vandtætte skotter
<!-- .element: class="fragment" -->

---

## Mål
Privacy by Design

At tilsikre at virksomheder aldrig læser eller skriver på tværs af enterprises igennem vores API'er
<!-- .element: class="fragment" -->

- Er enterpriseId nok? <!-- .element: class="fragment" -->
- Hvad gør vi med machine-2-machine? <!-- .element: class="fragment" -->
- Hvordan håndtere vi vores nuværende løsning? <!-- .element: class="fragment" -->
- Skal være uafhængigt at EF Core <!-- .element: class="fragment" -->

---

## API'er i dag
I dag giver vi et enterprise id eller en liste af company ids i url'en:


```http
GET /enterprise/108/vehicle/123
```
<!-- .element: class="fragment" -->

eller 

```http
GET /vehicle/123?companyIds=3857&companyIds=1337
```
<!-- .element: class="fragment" -->


_Det kræver at vi husker at tilføje det til url'en og forretningslogikken_
<!-- .element: class="fragment" -->

----

## Vehicle API'et i dag
### Og andre API følger
Det bliver nu implicit udfra user-context
<!-- .element: class="fragment" -->


```http
GET /vehicle/123
x-user-context: { organization: { companyIds: [3857, 1337] }}
```
<!-- .element: class="fragment" -->


_Vil for code-flow (BFF'er) være en del af access-token, som på sigt kan sendes med til API'erne_
<!-- .element: class="fragment" -->

----

## Ekstern Gateway
For machine-2-machine er det lidt mere udfordrende - hvilke companies hører en klient til?
<!-- .element: class="fragment" -->

- En klient har nogle capabilities og permissions <!-- .element: class="fragment" -->
- Capability kunne være Read.Vehicle(enterprise: 108) <!-- .element: class="fragment" -->
- Tillader f.eks. kald til /enterprise/108/vehicle/42  <!-- .element: class="fragment" -->
- Gateway har ansvaret for at afvise <!-- .element: class="fragment" -->
- Gateway opløser 108, og sætter ind som companyIds i user-context <!-- .element: class="fragment" -->


__Stadig ikke implementeret!__ <!-- .element: class="fragment" -->

----
## API svar
Hvad skal `GET /vehicle/123` returnere?

<ul>
  <li class='fragment'>403 Forbidden - oplagt, leaker data</li>
  <li class='fragment'><b>404 Not Found</b></li>

Hvad med `POST /company/3857/vehicle`? 

  <li class='fragment'><b>403 Forbidden</b> - leaker ikke data</li>
</ul>


----

## API noter

- Det ene udlukker ikke det andet. <!-- .element: class="fragment" -->
```http
GET /vehicle/123?companyId=3857
x-user-context: { companyIds: [3857, 1337] }
```
<!-- .element: class="fragment" -->
- Hvis ikke der sendes companyIds med ind, vil vi lige nu give adgang til alt.  <!-- .element: class="fragment" -->  
  _Kan ændre sig når vi har trykprøvet det._ <!-- .element: class="fragment" -->


---

# Kodeeksempler v2
## Lidt mere stabile  <!-- .element: class="fragment" -->

----
## Setup

```c#
// data/StartupApplication.cs
services.ConfigureShutters(factory =>
  factory.Configure<Vehicle>(config => config
    // Employees are allowed to access vehicles in own enterprise
    .For<Identity.Employee>((e, v) =>
      e.CompanyIdsInEnterprise == null || e.CompanyIdsInEnterprise.Contains(v.CompanyId))
    // Block systems
    .For<Identity.System>((s, v) => false)
  )
);
```
<!-- .element: class="fragment" -->

----

## DB Context
### Læsninger

<div class='r-stack'>

```c#
public class VehicleCommandContext(
  DbContextOptions options

) : DbContext(options)
{
  
  public DbSet<Vehicle> Vehicles { get; set; } = null!;

}
```
<!-- .element: class="current-visible" -->

```c#
public class VehicleCommandContext(
  DbContextOptions options,
  Shutters shutters 
) : DbContext(options)
{
  // Er nu en queryable. Mangler .Add
  public IQueryable<Vehicle> Vehicles => Set<Vehicle>()
    .Apply(shutters);
}
```
<!-- .element: class="fragment" -->

```c#
public class VehicleCommandContext(
  DbContextOptions options,
  Shutters shutters 
) : ShutteredContext(options, shutters)
{
  // Er nu en queryable. Mangler .Add
  public IQueryable<Vehicle> Vehicles => Set<Vehicle>();

}
```
<!-- .element: class="fragment" -->

</div>


----

## DB Context
### Skrivninger

<div class='r-stack'>

```c#
public class VehicleCommandContext(
  DbContextOptions options

) : DbContext(options) {
  protected override void OnConfiguring(DbContextOptionsBuilder o) {






  }
}
```
<!-- .element: class="current-visible" -->

```c#
// DEPRECATED
public class VehicleCommandContext(
  DbContextOptions options,
  Shutters shutters 
) : DbContext(options) {
  protected override void OnConfiguring(DbContextOptionsBuilder o) {
    SavingChanges += (_, _) => {
      var result = Result.Combine(ChangeTracker.Entries()
        .Select(e => shutters.ValidateAccessTo(e.Entity)));
      
      if (result.IsFailure) // throw exception
    };
  }
}
```
<!-- .element: class="fragment" -->

</div>


----

## Læsninger

<div class='r-stack'>

```c#
// Test setup
GrantAccessTo(3857, 1337); 

UsingContext<VehicleCommandContext>()
  .Vehicles

  .ToList();

/**
SELECT ...
FROM koerertoejer
WHERE companyId IN (3857, 1337)  


*/
```
<!-- .element: class="current-visible" -->


```c#
// Test setup
GrantAccessTo(3857, 1337); 

UsingContext<VehicleCommandContext>()
  .Vehicles

  .SingleOrDefault(x => x.Id = 42);

/**
SELECT TOP 2 ...
FROM koerertoejer
WHERE companyId IN (3857, 1337)

  AND id = 42
*/
```
<!-- .element: class="fragment" -->


```c#
// Test setup
GrantAccessTo(3857, 1337); 

UsingContext<VehicleCommandContext>()
  .Vehicles
  .Where(x => x.CompanyId = 3857)
  .SingleOrDefault(x => x.Id = 42);

/**
SELECT TOP 2 ...
FROM koerertoejer
WHERE companyId IN (3857, 1337)
  AND companyId = 3857
  AND id = 42
*/
```
<!-- .element: class="fragment" -->

</div>


----

## Skrivninger

<div class='r-stack'>

```c#
// Test setup
GrantAccessTo(3857, 1337); 

var ctx = UsingContext<VehicleCommandContext>();

ctx.Add(new Vehicle {
  CompanyId = 3857
});

ctx.SaveChanges(); // Succeeds
```
<!-- .element: class="current-visible" -->


```c#
// Test setup
GrantAccessTo(3857, 1337); 

var ctx = UsingContext<VehicleCommandContext>();

ctx.Add(new Vehicle {
  CompanyId = 3858
});

ctx.SaveChanges(); // Throws AccessDeniedException AKA 403
```
<!-- .element: class="fragment" -->

</div>

----

## Nested properties

- Virker for læsninger <!-- .element: class="fragment" -->
```c#
  services.ConfigureShutters<VehicleExtended>(config => config
    // Employees are allowed to access vehicles in own enterprise
    .For<Identity.Employee>((e, x) =>
      e.CompanyIdsInEnterprise.Contains(x.Vehicle.Id))
  )
```
<!-- .element: class="fragment" -->
```sql
  SELECT ...
  FROM vehicleExtended ve
  LEFT JOIN vehicle v ON v.Id = ve.Id
  WHERE v.CompanyId IN (...)
```
<!-- .element: class="fragment" -->
- Skrivninger skal kende companyId'et in-process <!-- .element: class="fragment" -->
  - Forvent en løsning ifm DDD repositories <!-- .element: class="fragment" -->

---
## 👏👏👏👏
### 👏 Der må godt klappes 👏
## 👏👏👏👏