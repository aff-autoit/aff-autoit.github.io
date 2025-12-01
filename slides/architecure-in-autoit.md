---
title: Arkitektur
subTitle: i AutoDesktop
status: draft
---

# Arkitektur
## i AutoDesktop

---

## Formål
> Vi vil gerne højne kvaliteten af vores kode og reviews. Det kræver at vi er alignet omkring vores arkiktur.
<!-- .element: class="fragment" -->

---

## Nøglebegreber

- Micro service <!-- .element: class="fragment" -->
- REST <!-- .element: class="fragment" -->
- CQRS <!-- .element: class="fragment" -->
- Domain Driven Design <!-- .element: class="fragment" -->
- Clean Architecture <!-- .element: class="fragment" -->
- Gateways og BFF'er <!-- .element: class="fragment" -->
- Result\<T\>  <!-- .element: class="fragment" -->

---

## Micro service

_Noget med at vi lige nu har for mange afgængigheder_  
_Måske en graf?_  
_Løs kobling (også af data)_

---

## REST

Er blevet synonym med et http api.  
Noget med [4 Maturity Levels of REST API Design](https://blog.restcase.com/4-maturity-levels-of-rest-api-design/)  
Level 0 - The Swamp of POX  
Level 1 - Resources  
Level 2 - Methods  
Level 3 - Hypermedia Controls  

---

## CQRS

Vil vi, og hvad hører til hvor?  
Uanset er tanker bag fine:  
Commands arbejder på aggregate roots  
Queries arbejder på hvad der giver bedst performance


---

## DDD

Aggregate roots, repositories, domain events

- Loaders = Repositories

---

## Clean architecture

Cleanish vs clean

---

## Gateways og bff'er

???

---

## Result???

Ikke en erstatning til exceptions!  
status 4xx = result  
status 5xx = exception  
Nye konstruktioner (Amalie)

---

## Det gode review

Konkret kode - fint, men ofte nit?  
Overstående rammer  
MoSCoW?  
Tidshorizont?  
Pair programming?  