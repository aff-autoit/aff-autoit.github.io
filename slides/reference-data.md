---
title: Reference Data
status: draft
---

# Reference Data
## Hvad er det?
<!-- .element: class="fragment" -->

---
## Hvad er det?
- Fronten har brug for ekstra data for at rendere en side
- Enums og oversættelser
- Muligheder for filtrering
- Muligheder for integrationsinformation

---
## Enums
### AS-IS
- API levere mulige enums i endpoint
- API-udgivelse kræver ikke web udgivelse
- Oversættelse ligger derfor i API
- Ny enum i output er breaking change!
- Slettet enum i input er breaking change!

----
## Enums
### TO-BE
- API levere mulige enums i swagger.json
- API-udgivelse kræver som minium udgivelse af BFF
- Oversættelser ligger i BFF/WEB
- Breaking changes bliver tydelige i BFF

----
## Enums
### Eftertanke
Hvornår er enums det rigtige valg?

---
## Filtermuligheder
### AS-IS

- API leverer muligheder for filtre
- Et endpoint til muligheder
- Et endpoint til data
- Understøtter ikke drill down

----
## Filtermuligheder
### TO-BE?

- API levere muligheder for filtre
- Samme endpoint som data
- Kan understøtte drill down, da queriet er tilgængeligt

---
## Filtermuligheder
### Eksempel
Simplificeret filtre

<div class='r-stack'>

``` HTTP
GET /vehicles
{
  data: [...],
  availableFilters: {
    fuelType: ["B/EL", "B", "D"],
    location: ["x", "y", "z"]
  }
}
```
<!-- .element: class="current-visible" -->

``` HTTP
GET /vehicles?fuelType=B
{
  data: [...],
  availableFilters: {
    fuelType: ["B/EL", "D"],
    location: ["x"]
  }
}
```
<!-- .element: class="fragment current-visible" -->

``` HTTP
GET /vehicles?fuelType=B&fuelType=D
{
  data: [...],
  availableFilters: {
    fuelType: ["B/EL"],
    location: ["x", "z"]
  }
}
```
<!-- .element: class="fragment current-visible" -->

</div>

----
## Filtermuligheder
### Eftertanker

- Hvad med paginering?  
  _Måske ok, da listen kan have ændret sig_
- Hvad med Performance?  
  _Det må testes_
- Hvad med implementationen?  
  _Det kommer nok til at minde meget om det vi har i dag_