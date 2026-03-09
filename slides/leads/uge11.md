---
title: Platformsarkitektur
subTitle: Uge 11
---

## Platformsarkitektur
# Uge 11

---

## Travlhed

- Det gode review
- Jyske
- After Sales
- Pentest
- Sikkerhed
  - Identity Server
  - Policy Provider
  - JWT'er

---

## Jyske

- Secrets
- Webhooks
- Gitflow

----

### Jyske
## Webhooks

> Vi vil ikke forurene vores eksterne gateway med integrationsspecifikke endpoints med intergrationsspecifk auth.  
F.eks. BCA webhook og spense

Åben reverse proxy på webhooks.autodestop.dk

----

### Jyske
## GitFlow

- Development er standard branch
  - push deployer til dev
- Release laves via action
  - Laver tag + release branch
  - Laver GH release med en binary
- Deploys til staging og prod via action
  - Altid samme binary

---

## After Sales
### Showcase

- DDD
- Events
  - Wolverine
  - Audit log
- Fejlhåndtering
  - Exceptions
  - Statuskoder
  - Fejlkoder (discrinators)
- Optional - alternativ til json-patch

----

### Aftersales
## DDD

I applikationslaget:

```c#
public class SomeCommandHandler(IUnitOfWork uow) {
    public async Task Handle(SomeCommand cmd) {
        var aggregate = await uow.LoadSomeAgggreaget(cmd.id);
        aggregate.DoSomething();
    }
}

public class SomeQueryHandler(Repository repo) {
    public async Task<SomeEntity> Handle(SomeQuery query) {
        var entity = await repo.SomeQueryAsync(query.SomeField);
        return entity;
    }
}
```


----

### Aftersales
## Events

Emittes fra domænelaget

```c#
public class SomeAggregate : AggregatRoot {
    public void DoSomthing() {
        _ditSomethingCount++;
        Emit(new DidSomething());
    }
}
```

Samles op i Unit Of Work og gemmes via Wolverine.  
Bliver bl.a. gemt i en audit log

----

### Aftersales
## Fejlhåndtering

Smides relevant lag:

```c#
public class SomeAggreagete {
    public void DoSomething() {
        throw new CouldNotDoSomethingExceptopn {
            BacauseOf = "The position of the moon"
        };
    }
}

public class UnitOfWork() {
    public async SomeAggragetRoot Load() {
        throw new NotFoundException();
    }
}
```

----

### Attersales
## Fejlhåndtering

Kommer pænt ud af api'et:

```json
// Status 409?
{
    "ERROR_CODE": "CouldNotDoSomething",
    "bacauseOf":"The position of the moon"
}
```

Vi arbejder på aggregering, men det kunne meget vel ende i stil med:


```json
// Status 422?
{
    "$": [{
        "ERROR_CODE": "CouldNotDoSomething",
        "bacauseOf":"The position of the moon"
    }],
    "$.email": [{
        "ERROR_CODE": "BadEamil"
    }]
}
```


----

### Aftersales
## Optional

```c#
public class MyRequest {
    public Optional<string?> Name { get; init; }
}
```

Vi bruger dotnexts Optional

---

## Hvad med refinement?