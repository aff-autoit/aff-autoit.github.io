---
title: Cancellation Tokens
status: draft
---

### Galt eller
## Genialt

# Cancelation Tokens <!-- .element: class="fragment" -->

---

## Hvad er en cancellation token?

> [...] .NET uses a unified model for cooperative cancellation of asynchronous or long-running synchronous operations. This model is based on a lightweight object called a cancellation token. The object that invokes one or more cancelable operations, for example by creating new threads or tasks, passes the token to each operation. Individual operations can in turn pass copies of the token to other operations. At some later time, the object that created the token can use it to request that the operations stop what they are doing. Only the requesting object can issue the cancellation request, and each listener is responsible for noticing the request and responding to it in an appropriate and timely manner.
> 
> -- <cite>learn.microsoft.com</cite>
<!-- .element: class="fragment" -->

----

## Hvad er en cancellation token?

- Afbryder asynkrone operationer 
<!-- .element: class="fragment" -->
- Afbrydes et API request, kan et S
<!-- .element: class="fragment" -->QL query også afbrydes
- Trivielt en god idé for læsninger
<!-- .element: class="fragment" -->
- Hvad med skrivninger? Det vender vi lige tilbage til
<!-- .element: class="fragment" -->
- Konceptet findes i de fleste sprog. JavaScript: AbortSignal
<!-- .element: class="fragment" -->

---

## Kan injectes i controller metoder

```c#
public class MyController : ControllerBase {
  [HttpGet("greet")]
  public Task<string> Greet(
    [FromQuery] name,
    CancellationToken cancellationToken
  ) {

  }
}
```

----

## Overload findes for api kald

```c#
public interface IVehicleClient

  Task<VehicleResponse> GetVehicleAsync(
    long vehicleId
  );

  Task<VehicleResponse> GetVehicleAsync(
    long vehicleId,
    CancellationToken cancellationToken
  );
```

----

## Entity framework har dem

```c#
public static class EntityFrameworkQueryableExtensions {
  public static async Task<List<TSource>> ToListAsync<TSource>(
    this IQueryable<TSource> source,
    CancellationToken cancellationToken = default) => ...
}
```

----

## SharedKernel har dem...
## ikke
<!-- .element: class="fragment" -->

```c#
public interface IQueryHandler<TQuery> where TQuery : IQuery
{
  Task<Result> ExecuteAsync(TQuery query);
}
```
<!-- .element: class="fragment" -->

Det kunne godt give mening at have dem med på sigt, men vi skal være opmærksomme på impact.
<!-- .element: class="fragment" -->

---

## Løsning 1
### Tilføj til query

```c#
public class MyQuery : Query
{
  public CancellationToken CancellationToken { get; init; }
}

public class MyQueryHandler(IService service)
  : QueryHandler<MyQuery, object>
{
  public async Task<object> Handle(MyQuery query) {
    // IService udvides med cancellation token
    await _service.DoSomethingAsync(query.CancellationToken);
  }
}
```
<!-- .element: class="fragment" -->

_Hører token til på en forespørgsel?_
<!-- .element: class="fragment" -->

----

## Løsning 2
### Cancel ved dispose

```c#
public class Service(DbContext ctx) : IService, IDisposable {
  private readonly CancellationTokenSource _cts = new();

  public Task DoSomething() {
    await ctx.Vehicles.ToListAsync(_cts.Token);
  }

  public void Dispose() {
    _cts.Cancel();
    _cts.Dispose();
  }
}
```
<!-- .element: class="fragment" -->

_Virker ikke til formålet! IoC scoped bliver først disposed når kodeblokken er færdig._
<!-- .element: class="fragment" -->

----

## Løsning 3
### Inject Cancellation Token
```c#
public class Service(
  DbContext ctx,
  CancellationToken cancellationToken
) : IService
{
  public Task DoSomething() {
    await ctx.Vehicles.ToListAsync(cancellationToken);
  }
}

// Startup.cs
services.AddScoped(typeof(CancellationToken), p => p
  .GetRequiredService<IHttpContextAccessor>()
  .HttpContext?.RequestAborted ?? CancellationToken.None);
```
<!-- .element: class="fragment" -->

_Cancellation token vil altid være bundet til requestes levetid. Kan man se det?_
<!-- .element: class="fragment" -->

----

## Cancellation token kan kombineres
```c#
public MyService(CancellationToken iocToken, DBContext context) {
  private readonly CancelleationTokenSource _cts =
    CancellationTokenSource.CreateLinkedTokenSource(iocToken);

  public async Task DoSomethingAsync(CancellationToken token) {
    await context.Set<Users>().ToListAsync(CancellationTokenSource
      .CreatedLinedTokenSoure(_cts.Token, token).Token);
  }

  public void Dispose() {
    _cts.Cancel(); _cts.Dipose();
  }
}

```
<!-- .element: class="fragment" -->

Så den ene udelukker ikke det andet.
<!-- .element: class="fragment" -->

----

## Hvad er forskellen?

- På metode niveau: kalderen kan annullere kaldet
<!-- .element: class="fragment" -->
  - Standard i nærmest alle asynkrone kald
<!-- .element: class="fragment" -->
  - Uafhængigt af request
<!-- .element: class="fragment" -->
- Som disposable: kaldet bliver annulleret når klassen bliver nedlagt
<!-- .element: class="fragment" -->
  - Her når IoC'en er færdig med sit nuværene scope
<!-- .element: class="fragment" -->
- På klasse niveau: creatoren kan annullere kaldet
<!-- .element: class="fragment" -->
  - Creatoren er her http requestet
<!-- .element: class="fragment" -->
  - Løser vores nuværende problem
<!-- .element: class="fragment" -->



---
## Hvad med commands

Commands kan som udgangspunkt godt annulleres, men:

Hvis der er tale om sideeffekter på bagkant af intentionen (f.eks. et kald til Integration Hub), må denne del ikke annulleres!
<!-- .element: class="fragment" -->

Det er muligvis tegn på noget andet, og vi har en plan (hint: event bus)
<!-- .element: class="fragment" -->

---
## Konklussion

- Vi understøtter cancallation tokens i vores arkitektur
<!-- .element: class="fragment" -->
  - Bortset fra handlers - kandidat til udvidelse
<!-- .element: class="fragment" -->
- Inject cancellation tokens i services der har tunge kald
<!-- .element: class="fragment" -->
  - F.eks. bilisten
<!-- .element: class="fragment" -->
  - Tilføj efter behov
<!-- .element: class="fragment" -->
- Cancellation tokens for disposable?
<!-- .element: class="fragment" -->
  - Fint koncept, men løser ikke noget her og nu
<!-- .element: class="fragment" -->
