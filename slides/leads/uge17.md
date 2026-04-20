---
title: Platformsarkitektur
subTitle: Uge 17
---

## Platformsarkitektur
# Uge 17

---

## Siden sidst

- After Sales <!-- .element: class="fragment" -->
  - Fejlhåndtering <!-- .element: class="fragment" -->
  - Afhængigheder og Data aggregering <!-- .element: class="fragment" -->
- Provider Pattern  <!-- .element: class="fragment" -->
- Azure <!-- .element: class="fragment" -->
  - Key Vault <!-- .element: class="fragment" -->
  - Service Bus <!-- .element: class="fragment" -->
- Pentest resultat <!-- .element: class="fragment" -->
- Database versionering (løs plan) <!-- .element: class="fragment" -->
- Wolverine <!-- .element: class="fragment" -->


---

## After Sales
### Fejlhåndtering - API

```HTTP
GET /some/endpoint
```
<!-- .element: class="fragment" -->

Fejler med en domæne fejl (409 eller 422) <!-- .element: class="fragment" -->

```json
{
	"ERROR_CODE": "SOME_ERROR"
}
```
<!-- .element: class="fragment" -->

```json
{
	"ERROR_CODE": "ANOTHER_ERROR",
	"aProperty": "a-value"  
}
```
<!-- .element: class="fragment" -->

----

## After Sales
### Fejlhåndtering - OpenAPI

```yml
# Not 100% formal OpenAPI
some/endpoint:
	responses:
		4xx:
			oneOf:
				- $ref: '#/components/SomeError'
				- $ref: '#/components/AnotherError'
			discriminator: 
				propertyName: ERROR_CODE
				mapping:
					SOME_ERROR: '#/components/SomeError'
					ANOTHER_ERROR: '#/components/AnotherError'
```
<!-- .element: class="fragment" -->

----

## After Sales
### Fejlhåndtering - .NET

<div class='r-stack'>

```c#
/// System.Text.Json abstraction
[JsonPolymorphic(TypeDiscriminatorPropertyName = "ERROR_CODE")]
[JsonDerivedType(typeof(SomeError), typeDiscriminator: "SOME_ERROR")]
[JsonDerivedType(typeof(AnotherError), typeDiscriminator: "ANOTHER_ERROR")]
record DomainError;

record SomeError : DomainError;

record AnotherError(string AProperty) : DomainError;
```
<!-- .element: class="fragment" -->

```c#
/// Our abstraction (concept)
[DiscriminatorProperty("ERROR_CODE")]
record DomainError;

[DiscriminatorValue("SOME_ERROR")]
record SomeError : DomainError;

[DiscriminatorName("ANOTHER_ERROR")]
record AnotherError(string AProperty) : DomainError;
```
<!-- .element: class="fragment" -->

</div>
----


## After Sales
### Fejlhåndtering - TypeScript

```typescript

type DomainError = 
	{ ERROR_CODE: "SOME_ERROR" } |
	{ ERROR_CODE: "ANOTHER_ERROR" 
		aProperty: string
	} 
```

----

## After Sales
### Afhængigheder og dataaggregering

- Vi vil gerne minimere afhængigheder <!-- .element: class="fragment" -->
- Vi vil gerne undgå cykliske afhængigheder. <!-- .element: class="fragment" -->
  - AfterSales må godt kende f.eks. kunde og vehicle api'et <!-- .element: class="fragment" -->
  - Men ikke omvendt <!-- .element: class="fragment" -->
- Data aggregeres som udgangspunkt i BFF'en <!-- .element: class="fragment" -->
  - Et kundenavn er formentlig ikke relevant i AfterSales api'et <!-- .element: class="fragment" -->
- Filtering og sortering <!-- .element: class="fragment" -->
  - Skal der filteres eller sorteres på kundenavn, er historien måske en anden <!-- .element: class="fragment" -->
  - Det kigger vi på i 2027 <!-- .element: class="fragment" -->

----

## Ater Sales
### Andet?

---

## Provider Pattern

> Strategy Pattern på service niveau

- Aftager udstiller et OpenAPI spec <!-- .element: class="fragment" -->
  - F.eks. har Leasing brug for at hente finansielle produkter fra et finansieringsselskab <!-- .element: class="fragment" -->
- Provider implementerer denne spec <!-- .element: class="fragment" -->
  - Jyske API'et er bl.a. en provider <!-- .element: class="fragment" -->
- På runtime kan vælges den rigtige url ift konteksten <!-- .element: class="fragment" -->

---

## Azure

Både Key Vault og Service Bus kræver adgang til Azure. <!-- .element: class="fragment" -->

- I første omgang bruger vi Application Registration og Shared Acces Policy som vi gemmer i git <!-- .element: class="fragment" -->
- Jeg, KH og NHL er i gang med en bedre løsning <!-- .element: class="fragment" -->
  - Application Registration i env <!-- .element: class="fragment" -->
  - Azure Arc pr server <!-- .element: class="fragment" -->

---

## Pentest
### Resultat

- Nøgler og/eller hemmeligheder hard-coded
  - Vi er i gang <!-- .element: class="fragment" -->
- Manglende HTTP Strict Transport Security
  -  HSTS i næste sprint <!-- .element: class="fragment" -->
- Clickjacking
  -  NUXT <!-- .element: class="fragment" -->
- Manglende eller for åben content security
  - NUXT <!-- .element: class="fragment" -->
- White-box: Kode Feedback
  - Binary Formatter <!-- .element: class="fragment" -->
  - PasswordHash i Policy Provideren <!-- .element: class="fragment" -->
- Insecure direct object references (IDOR)
  - Nej <!-- .element: class="fragment" -->

---

##  Database versionering 
### Løs plan

- Første milepæl: auditing <!-- .element: class="fragment" -->
	- Database project i Visual Studio <!-- .element: class="fragment" -->
	- Versionsstyret <!-- .element: class="fragment" -->
	- Branch pr env <!-- .element: class="fragment" -->
- Anden milepæl: versionering <!-- .element: class="fragment" -->
	- Branches skal alignes <!-- .element: class="fragment" -->
	- Tags og releases på sigt <!-- .element: class="fragment" -->
	- GitFlow <!-- .element: class="fragment" -->
	- Normalt kodeflow, review og afhængigheder <!-- .element: class="fragment" -->

> Vi har ikke tiden pt
<!-- .element: class="fragment" -->

---

## Wolverine

- Erfaring i After Sales <!-- .element: class="fragment" -->
  - Full blown Wolverine <!-- .element: class="fragment" -->
- Hvad får vi <!-- .element: class="fragment" -->
  - Integration til Azure, SQL Server og EF Core <!-- .element: class="fragment" -->
  - Inbox + outbox <!-- .element: class="fragment" -->
  - Begrænset til en DbContext <!-- .element: class="fragment" -->
  - IL Weaving <!-- .element: class="fragment" -->
- Kan vi lave det selv? <!-- .element: class="fragment" -->
  - Er domæne events synkrone? <!-- .element: class="fragment" -->
  - Er der tale om en command queue frem for en outbox? <!-- .element: class="fragment" -->